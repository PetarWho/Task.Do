import React, {useState,useEffect } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TaskIcon from "@mui/icons-material/Task";
import CheckButton from "@mui/icons-material/RadioButtonUnchecked";
import { Link } from "react-router-dom";
import SpinnerLoading from "../Utils/SpinnerLoading";

function TaskList() {
  const tasks = [
    { id: 1, title: "Task 1", description: "Description 1" },
    { id: 2, title: "Task 2", description: "Description 2" },
    { id: 3, title: "Task 3", description: "Description 3" },
  ];

  const[isLoading,setIsLoading] = useState(true);

  
  useEffect(() => {
    // Simulating an asynchronous operation (e.g., data fetching)
    const fetchData = async () => {
      // Assume some asynchronous operation that takes time
      await new Promise((resolve) => setTimeout(resolve,200));

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
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            Tasks
          </Typography>
          <List>
            {tasks.map((task) => (
              <ListItem
                key={task.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="checked" disabled={true}>
                    <CheckButton disabled={true} />
                  </IconButton>
                }
                sx={{
                  border: "1px solid rgb(177, 226, 247)",
                  margin: "10px",
                  width: "auto",
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <TaskIcon />
                  </Avatar>
                </ListItemAvatar>
                <Link
                  to={`/task/${task.id}`}
                  state={{ task: task }}
                  style={{
                    textDecoration: "none",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  <ListItemText primary={task.title} />
                </Link>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TaskList;
