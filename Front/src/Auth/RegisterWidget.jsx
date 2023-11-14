
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function RegisterWidget({ onRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ username, email, password });
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="dense"
          value={username}
          onChange={handleUsernameChange}
          required
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="dense"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="dense"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <Button type="submit" variant="contained" color="primary" size="small">
          Register
        </Button>
      </form>
    </Box>
  );
}

export default RegisterWidget;
