import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useParams, Link } from "react-router-dom";
import SpinnerLoading from "../Utils/SpinnerLoading";
import BackButton from "../Utils/BackButton"; // Import BackButton
import Typography from "@mui/material/Typography"; // Import Typography
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import fetch from '../../axiosInterceptor';

function Task() {
  const { taskId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [task, setTask] = useState({ Title: "", Description: "" });
  const [subTasks, setSubTasks] = useState([]);
  const authToken = localStorage.getItem('authToken');
  const [userRole, setUserRole] = useState("");


  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("https://localhost:7136/api/Users/get_role", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });


        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const role = await response.text();
        setUserRole(role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskResponse = await fetch(`https://localhost:7136/api/tasks/get_by_id?taskId=${taskId}`, {
          method: "GET",
          headers: {
            "Content-Type": `application/json;`,
            Authorization: `Bearer ${authToken}`
          }
        });
        const subTasksResponse = await fetch(`https://localhost:7136/api/subtasks/all?taskId=${taskId}`, {
          method: "GET",
          headers: {
            "Content-Type": `application/json;`,
            Authorization: `Bearer ${authToken}`
          }
        });

        if (!taskResponse.ok || !subTasksResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const taskData = await taskResponse.json();
        const subTasksData = await subTasksResponse.json();
        setTask(taskData);
        setSubTasks(subTasksData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [taskId]);

  if (isLoading) {
    return <SpinnerLoading />;
  }


  return (
    <Box sx={{ flexGrow: 1, maxWidth: "100%" }}>
      <Grid container spacing={1}>
        {/* BackButton */}
        <Grid item xs={1} md={1} sx={{ marginTop: '10px' }}>
          <BackButton />
        </Grid>

        {/* Edit Button */}
        {userRole.includes("Manager") && (
          <>
            <Grid item xs={1} md={12} sx={{ textAlign: 'right', marginRight: '10px', marginTop: '-45px' }}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/editTask/${taskId}`}
              >
                Edit
              </Button>
            </Grid>
          </>
        )}
        {/* Task Title */}
        <Grid item xs={12} md={12}>
          <Typography variant="h6" component="div">
            {task.Title}
          </Typography>
        </Grid>



        {/* Task Description */}
        <Grid item xs={12} md={12}>
          <Typography variant="body1" component="div">
            {task.Description}
          </Typography>
        </Grid>

        {/* Display Subtasks in a table */}
        <Grid item xs={12} md={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ paddingLeft: '40px' }}>Subtask Title</TableCell>
                  <TableCell align="center">Notes</TableCell>
                  <TableCell align="center">Photos</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subTasks.map((subTask) => (
                  <TableRow key={subTask.id}>
                    <TableCell style={{ paddingLeft: '40px' }}>
                      <Link to={{ pathname: `/subtask/${subTask.id}`, state: { subtaskId: subTask.id } }} style={{ textDecoration: 'none', fontSize: '1rem' }}>
                        {subTask.title}
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      {`${subTask.notesCount}/${subTask.requiredNotesCount}`}
                    </TableCell>
                    <TableCell align="center">
                      {`${subTask.photosCount}/${subTask.requiredPhotosCount}`}
                    </TableCell>
                    <TableCell align="center">
                      <span
                        style={{
                          fontWeight: subTask.isFinished ? "bold" : "normal",
                          color: subTask.isFinished ? "green" : "inherit",
                        }}
                      >
                        {subTask.isFinished ? "Completed" : "Incomplete"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
export default Task;
