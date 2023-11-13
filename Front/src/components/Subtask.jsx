import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import { FileUploader } from "./FileUploader";
import { useState } from "react";
import BackButton from "./BackButton";

function Subtask() {
  const location = useLocation();
  const [fileName, setFileName] = useState("");
  const handleFile = (file) => {
    setFileName(file.name);
  };
  const subtask = location.state
    ? location.state.subtask
    : { title: "", description: "" };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: "100%" }}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "52%",
            }}
          >
            <Box sx={{ paddingLeft: "10px" }}>
              <BackButton />
            </Box>
            <Box>
              <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                {subtask.title}
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            {subtask.description}
          </Typography>
          <FileUploader handleFile={handleFile} />
          {fileName ? <p>Uploaded file: {fileName}</p> : null}
        </Grid>
        <Grid item xs={12} md={12}>
          <Button
            variant="outlined"
            disabled
            style={{ color: "green", borderColor: "green" }}
            component="div"
          >
            Done
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Subtask;
