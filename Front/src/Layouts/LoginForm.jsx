import React, { useState } from "react";
import LoginWidget from "../Auth/LoginWidget";
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Modal } from '@mui/material';
import './LoginForm.css';



function LoginForm() {
  const [message, setMessage] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [username, setUsername] = useState("");
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

        const userResponse = await fetch(`https://localhost:7136/api/users/get_by_token`, {
          headers: {
            Authorization: `Bearer ${answer.token}`,
          },
        });

        if (userResponse.ok) {
          const userDetails = await userResponse.json();
          console.log('User Details:', userDetails); // Log the response
        
          // Ensure that the structure of the userDetails object is as expected
          setUsername(userDetails.userName);
        } else {
          throw new Error(`Failed to fetch user details. Status: ${userResponse.status}`);
        }
        

        setMessage("You are logged");
        setShowWelcomeModal(true);

        setTimeout(() => {
          setShowWelcomeModal(false);
          setUsername("");
          navigate('/');
        }, 1300);
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      setMessage("Login failed. Please try again."); // Update the error message
    }
  };

  const handleCloseModal = () => {
    setShowWelcomeModal(false);
    setUsername("");
    navigate('/');
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <LoginWidget onLogin={handleLogin} />
      </div>
      <div>{message && <p>{message}</p>}</div>

      {/* Welcome Modal */}
      <Modal open={showWelcomeModal} onClose={handleCloseModal}>
        <div className="custom-modal-content">
          <h2>Welcome, {username}!</h2>
          <p>Thank you for logging in.</p>
        </div>
      </Modal>

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
