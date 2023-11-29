import React, { useState } from "react";
import RegisterWidget from "../Auth/RegisterWidget";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Typography,Modal } from "@mui/material";

function RegistrationForm() {
  const [message, setMessage] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const typeAndDataDistinction = (data) => {
    const { type, ...dataWithoutType } = data;
    const endpoint = type === 0 ? "employee" : "manager";
    handleRegister(endpoint, dataWithoutType);
  };

  const handleRegister = async (endpoint, data) => {
    try {
      const response = await fetch(
        `https://localhost:7136/api/Account/register/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

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

      setMessage("Registration ");
      setShowWelcomeModal(true);

      setTimeout(() => {
        setShowWelcomeModal(false);
        setUsername("");
        navigate('/');
      }, 1300);
      
    } catch (error) {
      console.error("Registration failed:", error.message);
    }
  };

  const handleCloseModal = () => {
    setShowWelcomeModal(false);
    setUsername("");
    navigate('/');
  };

  return (
    <div>
      <h2>Registration</h2>
      <RegisterWidget onRegister={(data) => typeAndDataDistinction(data)} />
      <div>{message && <p>{message}</p>}</div>
      {/* Welcome Modal */}
      <Modal open={showWelcomeModal} onClose={handleCloseModal}>
        <div className="custom-modal-content">
          <h2>Welcome, {username}!</h2>
          <p>Thank you for your registration.</p>
        </div>
      </Modal>
      <Typography variant="body2" mt={2}>
        Already have an account?{" "}
        <Link to="/Login" style={{ color: "inherit" }}>
          Sign in
        </Link>
      </Typography>
    </div>
  );
}

export default RegistrationForm;
