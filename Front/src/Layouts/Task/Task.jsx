import React, { useState,useEffect } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CheckSubTask from "@mui/icons-material/CheckBoxOutlineBlank";
import Button from "@mui/material/Button";
import { useLocation, Link } from "react-router-dom";
import BackButton from "../Utils/BackButton";
import SpinnerLoading from "../Utils/SpinnerLoading";

function Task() {
  const location = useLocation();
  const task = location.state
    ? location.state.task
    : { title: "", description: "" };
  const subTasks = [
    { id: 1, title: "SubTask 1", description: "SubDescription 1" },
    { id: 2, title: "SubTask 2", description: "SubDescription 2" },
    { id: 3, title: "SubTask 3", description: "SubDescription 3" },
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
                {task.title}
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            {task.description}
          </Typography>
          <List>
            {subTasks.map((subtask, index) => (
              <ListItem
                key={index}
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
                  to={`/subtask/${subtask.id}`}
                  state={{ subtask: subtask }}
                  style={{
                    textDecoration: "none",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  <ListItemText primary={subtask.title} />
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
