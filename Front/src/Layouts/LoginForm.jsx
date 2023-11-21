import React from "react";
import LoginWidget from "../Auth/LoginWidget";

function LoginForm() {

  const handleLogin = async (data) => {
    try {
      const response = await fetch(`https://localhost:7136/api/Account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const answer = await response.json();
      console.log("Login successful:", answer);
      localStorage.setItem("token", answer.token);
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
    </div>
  );
}
export default LoginForm;
