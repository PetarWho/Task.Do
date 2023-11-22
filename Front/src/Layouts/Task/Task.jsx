import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CheckSubTask from "@mui/icons-material/CheckBoxOutlineBlank";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import BackButton from "../Utils/BackButton";
import SpinnerLoading from "../Utils/SpinnerLoading";

function Task() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`https://localhost:7136/api/tasks/all`);
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("An error occurred while fetching tasks", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
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
                {/* You can display the selected task details here */}
              </Typography>
            </Box>
          </Box>
          {/* Render the list of tasks */}
          <List>
            {tasks.map((task) => (
              <ListItem
                key={task.id}
                sx={{
                  border: "1px solid rgb(177, 226, 247)",
                  margin: "10px",
                  width: "auto",
                }}
              >
                <ListItemAvatar>
                  <CheckSubTask />
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
      <Button
        variant="outlined"
        disabled
        style={{ color: "green", borderColor: "green" }}
      >
        Done
      </Button>
    </Box>
  );
}

export default Task;
