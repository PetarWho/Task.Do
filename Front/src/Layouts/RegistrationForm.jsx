import React, { useState } from "react";
import RegisterWidget from "../Auth/RegisterWidget";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

function RegistrationForm() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegistration = async (data) => {
    try {
      const response = await fetch(
        `https://localhost:7136/api/Account/register/employee`,
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

      const answer = await response.json();
      localStorage.setItem("authToken", answer.token);
      setMessage("Registration successful!");
      navigate('/');
    } catch (error) {
      console.error("Registration failed:", error.message);
    }
  };

  return (
    <div>
      <h2>Registration</h2>
      <RegisterWidget onRegister={handleRegistration} />
      <div>{message && <p>{message}</p>}</div>
      <Typography variant="body2" mt={2}>
        Already have an account?{' '}
        <Link to="/Login" style={{ color: 'inherit' }}>
          Sign in
        </Link>
      </Typography>
    </div>
  );
}

export default RegistrationForm;
