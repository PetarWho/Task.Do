// TaskDetails.js

import React from "react";
import { Grid, TextField } from "@mui/material";

const TaskDetails = ({ taskTitle, taskDescription, taskStartDate, taskEndDate, setTaskTitle, setTaskDescription, setTaskStartDate, setTaskEndDate }) => {
  return (
    <Grid container spacing={2} sx={{ margin: "10px" }}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Task Name"
          variant="outlined"
          margin="normal"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Task Description"
          multiline
          rows={4}
          placeholder="Enter Task Description"
          variant="outlined"
          margin="normal"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <form noValidate>
          <TextField
            id="datetime-local-start"
            label="Start time"
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
            value={taskStartDate}
            onChange={(e) => setTaskStartDate(e.target.value)}
          />
        </form>
      </Grid>
      <Grid item xs={6}>
        <form noValidate>
          <TextField
            id="datetime-local-start"
            label="End time"
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
            value={taskEndDate}
            onChange={(e) => setTaskEndDate(e.target.value)}
          />
        </form>
      </Grid>
    </Grid>
  );
};

export default TaskDetails;
