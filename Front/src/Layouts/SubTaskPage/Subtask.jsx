import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import { FileUploader } from "../Utils/FileUploader";
import { useState } from "react";
import BackButton from "../Utils/BackButton";
import SpinnerLoading from "../Utils/SpinnerLoading";
import TextField from "@mui/material/TextField";

function Subtask() {
  const location = useLocation();
  const [fileName, setFileName] = useState("");
  const handleFile = (file) => {
    setFileName(file.name);
  };
  const subtask = location.state
    ? location.state.subtask
    : { title: "", description: "" };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating an asynchronous operation (e.g., data fetching)
    const fetchData = async () => {
      // Assume some asynchronous operation that takes time
      await new Promise((resolve) => setTimeout(resolve, 200));

      // After the asynchronous operation is complete, set isLoading to false
      setIsLoading(false);
    };

    fetchData();
  }, []); // The empty dependency array ensures the effect runs once after the initial render

  if (isLoading) {
    return <SpinnerLoading />;
  }
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
        <TextField
              id="outlined-multiline-static"
              label="Notes"
              multiline
              rows={6}
              placeholder="Leave a note"
              sx={{width: '300px'}}
            /> 
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
          <Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Subtask;
