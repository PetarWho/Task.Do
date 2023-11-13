import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";


function Footer() {
  return (
    <Paper
    square
    elevation={3}
    sx={{
      backgroundColor: "rgb(177, 226, 247)",
      textAlign: "center",
      padding: "10px",
      position: "fixed",
      bottom: 0,
      width: "100%",
    }}
  >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="body2"
              color="inherit"
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
              }}
            >
              © {new Date().getFullYear()} DiaDo. All rights reserved. Team-PVS
            </Typography>
          </Box>
        </Toolbar>
      </Container>
      </Paper>
  );
}

export default Footer;
