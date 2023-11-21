import React from "react";
import RegisterWidget from '../Auth/RegisterWidget'

function RegistrationForm() {

  const handleRegistration = (data, endpoint) => {
    handleRegister(endpoint, data);
  };

  const handleRegister = async (endpoint,data) => {
    try {
      const response = await fetch(`https://localhost:7136/api/Account/register/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const answear = await response.json();
      console.log("Registration successful:", answear);
    } catch (error) {
      console.error("Registration failed:", error.message);
    }
  };  

  return (
    <div>
      <h2>Register Employee</h2>
      <div>
      <RegisterWidget onRegister={(data) => handleRegistration(data, 'employee')} />
       </div>
      <h2>Register Manager</h2>
      <RegisterWidget onRegister={(data) => handleRegistration(data, 'manager')} />
    </div>
  );
}

export default RegistrationForm;
