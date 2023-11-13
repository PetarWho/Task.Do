import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import BackIcon from "@mui/icons-material/ArrowBack";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outlined"
      style={{ color: "rgb(255, 74, 47)", borderColor: "rgb(255, 74, 47)" }}
      onClick={() => navigate(-1)}
    >
      <BackIcon />
    </Button>
  );
};

export default BackButton;
