import React, { useState } from "react";
import LoginWidget from "../Auth/LoginWidget";
import { Link, useNavigate } from 'react-router-dom';
import {Typography} from '@mui/material';

function LoginForm() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (data) => {
    try {
      const response = await fetch("https://localhost:7136/api/Account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 400) {
          setMessage(errorText);
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } else {
        const answer = await response.json();
        localStorage.setItem("authToken", answer.token);
        setMessage("You are logged");
        navigate('/');
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <LoginWidget onLogin={handleLogin} />
      </div>
      <div>{message && <p>{message}</p>}</div>
      <Typography variant="body2" mt={2}>
        You don't have an account?{' '}
        <Link to="/Register" style={{ color: 'inherit' }}>
          Sign up
        </Link>
      </Typography>
    </div>
  );
}
export default LoginForm;