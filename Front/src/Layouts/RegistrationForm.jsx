import React, {useState} from "react";
import RegisterWidget from "../Auth/RegisterWidget";
import { useNavigate } from "react-router-dom";

function RegistrationForm() {
  const handleRegistration = (data) => {
    const { value, ...dataWithoutValue } = data;
    const endpoint = value === 0 ? "employee" : "manager";
    handleRegister(endpoint,dataWithoutValue)
  };
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (endpoint, data) => {
    try {
      const response = await fetch(
        `https://localhost:7136/api/Account/register/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setMessage("Registration successful!")
      navigate("/Login");
    } catch (error) {
      console.error("Registration failed:", error.message);
    }
  };

  return (
    <div>
      <h2>Registration</h2>
      <RegisterWidget onRegister={(data) => handleRegistration(data)} />
      <div>{message && <p>{message}</p>}</div>
    </div>
    
  );
}

export default RegistrationForm;