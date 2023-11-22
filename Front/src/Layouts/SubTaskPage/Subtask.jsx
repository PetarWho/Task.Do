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
  // const subtask = location.state
  //   ? location.state.subtask
  //   : { title: "", description: "" };

  const [isLoading, setIsLoading] = useState(true);
  const[subTasks,setSubTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskId = '550e8400-e29b-41d4-a716-446655440000';  //Hardcode example for Guid Id
        const apiUrl = `https://localhost:7136/api/subtasks/all?taskId=${taskId}`;
        const response = await fetch(apiUrl);
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const data = await response.json();
        setSubTasks(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } 
      setIsLoading(false);
    };
  
    fetchData();
  }, []);
  

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
                {subTasks.title}
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            {subTasks.description}
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
