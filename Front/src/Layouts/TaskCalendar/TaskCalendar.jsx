import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import './TaskCalendar.css';

const TaskCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate("/");
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await fetch('https://localhost:7136/api/Tasks/get_employee_tasks', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const tasksData = await response.json();
          setTasks(tasksData); 
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [navigate]);

  useEffect(() => {
    const updatedEvents = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      start: new Date(task.startDate), 
      end: new Date(task.endDate),
    }));
  
    setEvents(updatedEvents);
  }, [tasks]);

  const handleEventClick = (clickedInfo) => {
    const taskId = clickedInfo.event.id;

    navigate(`/task/${taskId}`);
  };

  return (
    <div style={{ height: 300}}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,timeGridWeek,dayGridMonth',
        }}
        events={events}
        eventClick={handleEventClick}
        selectable={true}
        slotMinTime="09:00:00"
        slotMaxTime="18:00:00"
        eventDidMount={(info) => {
          const eventEls = document.querySelectorAll('.fc-event');
          eventEls.forEach((el) => {
            el.style.cursor = 'pointer';
          });
        }}
      />
    </div>
  );
};

export default TaskCalendar;