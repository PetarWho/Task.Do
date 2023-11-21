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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "300px",
        margin: "0 auto",
      }}
    >
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="User" />
        <Tab label="Manager" />
      </Tabs>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />

        <TextField
          label="Password"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />

        <Button variant="contained" type="submit">
          Login
        </Button>
      </form>
    </Box>
  );
}

export default LoginWidget;
