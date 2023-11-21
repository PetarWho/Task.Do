import React, { useState } from 'react';
import './TaskPanel.css'; // Import the CSS file for styling

const TaskPanel = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    taskName: '',
    taskDescription: '',
    startDate: '',
    endDate: '',
    assignedUsers: [],
    subtasks: [],
  });

  // State for temporary storage of assigned user or subtask
  const [tempValue, setTempValue] = useState('');

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle changes in the temporary value
  const handleTempValueChange = (e) => {
    setTempValue(e.target.value);
  };

  // Function to add assigned user or subtask
  const handleAddItem = (type) => {
    if (tempValue.trim() !== '') {
      setFormData({
        ...formData,
        [type]: [...formData[type], tempValue],
      });
      setTempValue(''); // Clear the temporary value
    }
  };

  // Function to delete assigned user or subtask
  const handleDeleteItem = (type, index) => {
    const updatedList = formData[type].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [type]: updatedList,
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic here to handle the form submission, e.g., send data to a server
    console.log('Form submitted:', formData);
  };

  return (
    <div>
      <h2>Task Panel</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="taskName">Task Name:</label>
        <input
          type="text"
          id="taskName"
          name="taskName"
          value={formData.taskName}
          onChange={handleInputChange}
          required
        /><br />

        <label htmlFor="taskDescription">Task Description:</label>
        <textarea
          id="taskDescription"
          name="taskDescription"
          value={formData.taskDescription}
          onChange={handleInputChange}
          rows="4"
          required
        ></textarea><br />

        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleInputChange}
          required
        /><br />

        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleInputChange}
          required
        /><br />

        {/* Assigned Users */}
        <div>
          <label htmlFor="assignedUsers">Assigned Users:</label>
          <div>
            {formData.assignedUsers.map((user, index) => (
              <div key={index}>
                {user}
                <button type="button" onClick={() => handleDeleteItem('assignedUsers', index)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            id="assignedUsers"
            value={tempValue}
            onChange={handleTempValueChange}
          />
          <button type="button" onClick={() => handleAddItem('assignedUsers')}>
            Add
          </button>
        </div>

        {/* Subtasks */}
        <div>
          <label htmlFor="subtasks">Subtasks:</label>
          <div>
            {formData.subtasks.map((subtask, index) => (
              <div key={index}>
                {subtask}
                <button type="button" onClick={() => handleDeleteItem('subtasks', index)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            id="subtasks"
            value={tempValue}
            onChange={handleTempValueChange}
          />
          <button type="button" onClick={() => handleAddItem('subtasks')}>
            Add
          </button>
        </div>

        <button type="submit">Done</button>
      </form>
    </div>
  );
};

export default TaskPanel;
