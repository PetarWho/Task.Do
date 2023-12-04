import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TaskIcon from '@mui/icons-material/Task';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Pagination } from '@mui/material';
import fetch from '../../axiosInterceptor';


function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('https://localhost:7136/api/tasks/all', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('An error occurred while fetching tasks', error);
      }
    };

    fetchTasks();
  }, []);

  const createTask = () => {
    navigate('/createTask');
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: '100%' }}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            Tasks
          </Typography>
          <List>
            {currentTasks.map((task) => (
              <ListItem
                key={task.id}
                sx={{
                  border: '1px solid rgb(177, 226, 247)',
                  margin: '10px',
                  width: 'auto',
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
                    textDecoration: 'none',
                    fontFamily: 'Arial, sans-serif',
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
              display: 'flex',
              justifyContent: 'flex-end',
              margin: '10px',
            }}
          >
            <Button
              variant="outlined"
              style={{ color: 'green', borderColor: 'green' }}
              onClick={createTask}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>

  );
};

export default AdminTasks;
