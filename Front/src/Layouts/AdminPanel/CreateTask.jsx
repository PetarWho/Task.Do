import React, { useState } from "react";
import { useEffect } from "react";
import { Grid, TextField, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";

const CreateTask = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const navigate = useNavigate();
  const location = useLocation();
  const [subTasks, setSubTasks] = useState([
    { id: 1, title: "SubTask 1", description: "SubDescription 1" },
    { id: 2, title: "SubTask 2", description: "SubDescription 2" },
    { id: 3, title: "SubTask 3", description: "SubDescription 3" },
  ]);

  const [assignedUsers, setAssignedUsers] = useState([
    {
      id: 1,
      username: "Simona Simeonova",
    },
    {
      id: 2,
      username: "Peter Penev",
    },
    {
      id: 3,
      username: "Veselin Kokoshkov",
    },
  ]);
  const [submittedSubtask, setSubmittedSubtask] = useState(null);

  useEffect(() => {
    const receivedData = location.state?.submittedSubtask;
    if (receivedData) {
      console.log("Received subtask data:", receivedData);
      setSubmittedSubtask(receivedData);
    }
  }, [location.state]);

  useEffect(() => {
    if (submittedSubtask !== null) {
      setSubTasks((prevState) => [...prevState, submittedSubtask]);
    }
  }, [submittedSubtask]);

  const createSubtask = () => {
    navigate("/createSubtask");
  };

  const handleDeleteUser = (userId) => {
    const updatedUsers = assignedUsers.filter((user) => user.id !== userId);
    setAssignedUsers(updatedUsers);
  };
  const handleDeleteSubTask = (subTaskId) => {
    const updatedSubTasks = subTasks.filter(
      (subtask) => subtask.id !== subTaskId
    );
    setSubTasks(updatedSubTasks);
  };

  const handleCreateTask = async () => {
    try {
      
      const response = await fetch(`https://localhost:7136/api/tasks/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Task Title", 
          description: "Task Description", 
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(), 
          employees: assignedUsers.map(user => ({ employeeId: user.id })),
          subtasks: subTasks.map(subtask => ({
            title: subtask.title,
            description: subtask.description,
            requiredNotesCount: subtask.requiredNotesCount || 0,
            requiredPhotosCount: subtask.requiredPhotosCount || 0,
          })),
        }),
      });

      if (response.ok) {
        // Task created successfully
        console.log("Task created successfully");
        // You may want to redirect or handle success in some way
      } else {
        // Handle error
        console.error("Failed to create task");
      }
    } catch (error) {
      console.error("An error occurred while creating the task", error);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            marginBottom: "16px",
          }}
          variant="h6"
          component="div"
        >
          Create Task
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Grid container spacing={2} sx={{ margin: "10px" }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Task Name"
              variant="outlined"
              margin="normal"
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
            />
          </Grid>
          <Grid item xs={6}>
            <form noValidate>
              <TextField
                id="datetime-local-start"
                label="Start time"
                type="datetime-local"
                defaultValue="2017-05-24T10:30"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </Grid>
          <Grid item xs={6}>
            <form noValidate>
              <TextField
                id="datetime-local-end"
                label="End time"
                type="datetime-local"
                defaultValue="2017-05-24T10:30"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </Grid>
        </Grid>
        <List>
          {subTasks.map((subtask, index) => (
            <ListItem
              key={index}
              sx={{
                border: "1px solid rgb(177, 226, 247)",
                margin: "10px",
                width: "auto",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Link
                to={`/subtask/${subtask.id}`}
                state={{ subtask: subtask }}
                style={{
                  textDecoration: "none",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <ListItemText primary={subtask.title} />
              </Link>
              <ListItemAvatar>
                <DeleteIcon
                  onClick={() => handleDeleteSubTask(subtask.id)}
                  style={{ cursor: "pointer" }}
                ></DeleteIcon>
              </ListItemAvatar>
            </ListItem>
          ))}
        </List>
        <Grid
          item
          xs={12}
          md={12}
          sx={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}
        >
          <Button
            variant="outlined"
            style={{ color: "green", borderColor: "green" }}
            onClick={() => createSubtask()}
          >
            Add
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            margin: "10px",
            gap: "10px",
          }}
        >
          <Button
            variant="outlined"
            style={{ color: "green", borderColor: "green" }}
            onClick={handleCreateTask}
          >
            Done
          </Button>
          <Button
            variant="outlined"
            style={{ color: "red", borderColor: "red" }}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          Assigned users
        </Typography>
        <List>
          {assignedUsers.map((user) => (
            <ListItem
              key={user.id}
              sx={{
                margin: "10px",
                width: "auto",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <ListItemText primary={user.username} />
              <ListItemAvatar>
                <DeleteIcon
                  onClick={() => handleDeleteUser(user.id)}
                  style={{ cursor: "pointer" }}
                />
              </ListItemAvatar>
            </ListItem>
          ))}
        </List>

        <Grid
          item
          xs={12}
          md={12}
          sx={{ display: "flex", justifyContent: "flex-end", margin: "20px" }}
        >
          <Button
            variant="outlined"
            style={{ color: "green", borderColor: "green" }}
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CreateTask;
