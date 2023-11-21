import React, { useState } from "react";
import { Grid, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useNavigate } from "react-router-dom";

function CreateSubtask() {
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [needsImage, setNeedsImage] = useState(true); // default value for needsImage
  const [isRequired, setIsRequired] = useState(true); // default value for isRequired

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleTaskDescriptionChange = (event) => {
    setTaskDescription(event.target.value);
  };

  const handleSubmit = () => {
    const subtaskData = {
      title: taskName,
      description: taskDescription,
      needsImage: needsImage,
      isRequired: isRequired,
    };

    navigate("/createTask", { state: { submittedSubtask: subtaskData } });
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ width: "50%", margin: "auto" }}
    >
      <Grid item xs={12}>
        <Typography
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            marginBottom: "16px",
          }}
        >
          Create Subtask
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
        <TextField
          fullWidth
          label="Task Name"
          variant="outlined"
          margin="normal"
          value={taskName}
          onChange={handleTaskNameChange}
        />
      </Grid>
      <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
        <TextField
          fullWidth
          label="Task Description"
          multiline
          rows={4}
          placeholder="Enter Task Description"
          variant="outlined"
          margin="normal"
          value={taskDescription}
          onChange={handleTaskDescriptionChange}
        />
      </Grid>
      <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
        <FormControlLabel
          control={
            <Switch
              checked={needsImage}
              onChange={(e) => setNeedsImage(e.target.checked)}
            />
          }
          label="Needs image"
        />
      </Grid>
      <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
        <FormControlLabel
          control={
            <Switch
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
            />
          }
          label="Required"
        />
      </Grid>
      <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
        <Button variant="outlined" color="primary" onClick={handleSubmit}>
          Create
        </Button>
      </Grid>
    </Grid>
  );
}

export default CreateSubtask;
