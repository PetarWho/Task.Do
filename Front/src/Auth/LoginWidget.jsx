import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function LoginWidget({ onLogin }) {
  const [value, setValue] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password, userType: value === 0 ? "user" : "manager" });
  };

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxWidth: "300px",
      margin: "0 auto",
    }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="User" />
        <Tab label="Manager" />
      </Tabs>
      <form onSubmit={handleSubmit}>
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
          Login
        </Button>
      </form>
    </Box>
  );
}

export default LoginWidget;
