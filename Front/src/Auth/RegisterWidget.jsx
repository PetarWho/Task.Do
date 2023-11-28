import React, { useState } from "react";
import axios from "axios";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function RegisterWidget({ onRegister }) {
  const [type, setValue] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

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
    onRegister({username, email, password, type });
    // const url = `https://localhost:7136/api/register/employee`;
    // onRegister({ username, email, password });

    // const data = {
    //   Username: username,
    //   Email: email,
    //   Password: password,
    // };

    // axios.post(url, data)
    //   .then((result) => {
    //     const dt = result.data;
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
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
      <Tabs value={type} onChange={handleChange} centered>
        <Tab label="User" />
        <Tab label="Manager" />
      </Tabs>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="dense"
          value={username}
          onChange={handleUsernameChange}
          required
          sx={{margin: "10px"}}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="dense"
          value={email}
          onChange={handleEmailChange}
          required
          sx={{margin: "10px"}}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="dense"
          value={password}
          onChange={handlePasswordChange}
          required
          sx={{margin: "10px"}}
        />
        <Button type="submit" variant="contained" color="primary" size="small">
          Register
        </Button>
      </form>
    </Box>
  );
}

export default RegisterWidget;