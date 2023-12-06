import React from "react";
import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const SubtaskList = ({ subTasks, handleDeleteSubTask, handleEditSubtask }) => {
  return (
    <List sx={{ml:3}}>
      {subTasks.map((subtask, i) => (
        <ListItem
          key={i}
          sx={{
            border: "1px solid rgb(177, 226, 247)",
            margin: "10px",
            width: "auto",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <ListItemText
            primary={subtask.title ?? subtask.Title}
            onClick={() => handleEditSubtask(subtask)} // Invoke edit function without redirecting
            style={{
              textDecoration: "none",
              fontFamily: "Arial, sans-serif",
              cursor: "pointer",
            }}
          />
          <ListItemAvatar>
            <DeleteIcon
              onClick={() => handleDeleteSubTask(subtask.id)}
              style={{ cursor: "pointer" }}
            />
          </ListItemAvatar>
        </ListItem>
      ))}
    </List>
  );
};

export default SubtaskList;
