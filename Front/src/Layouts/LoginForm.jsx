import React, { useState } from "react";
import LoginWidget from "../Auth/LoginWidget";

function LoginForm() {
  const [message, setMessage] = useState("");

  const handleLogin = async (data) => {
    try {
      const response = await fetch("https://localhost:7136/api/Account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        localStorage.setItem("authToken", answer.Token);
        setMessage("You are logged");
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
    </div>
  );
}
export default LoginForm;