import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function LoginWidget({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
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
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{margin: "10px"}}
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
          sx={{margin: "10px"}}
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