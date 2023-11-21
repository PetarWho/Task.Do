import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TaskIcon from "@mui/icons-material/Task";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

function AdminTasks() {
  const tasks = [
    {
      id: 1,
      title: "Task 1",
      description: "Description 1",
      start: new Date().setHours(9, 0, 0, 0),
      end: new Date().setHours(10, 0, 0, 0),
    },
    {
      id: 2,
      title: "Task 2",
      description: "Description 2",
      start: new Date().setHours(12, 0, 0, 0),
      end: new Date().setHours(13, 0, 0, 0),
    },
    {
      id: 3,
      title: "Task 3",
      description: "Description 3",
      start: new Date().setHours(17, 0, 0, 0),
      end: new Date().setHours(18, 0, 0, 0),
    },
  ];
  const navigate = useNavigate();
  const createTask = () => {
    navigate("/createTask");
  };

  return (
    <>
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
            <Grid
              item
              xs={12}
              md={12}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                margin: "10px",
              }}
            >
              <Button
                variant="outlined"
                style={{ color: "green", borderColor: "green" }}
                onClick={() => createTask()}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
export default AdminTasks;
