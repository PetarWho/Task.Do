import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import './styleCalendar.css';

const AdminCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch tasks from the API
    const fetchTasks = async () => {
      try {
        const response = await fetch('https://localhost:7136/api/tasks/all');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data["$values"]); // Assuming the tasks array is under "$values"
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleEventClick = (clickedInfo) => {
    const clickedEvent = clickedInfo.event;
    const taskId = clickedEvent.extendedProps.taskId;

    navigate(`/task/${taskId}`);
  };

  const events = tasks.map((task) => ({
    id: task.Id,
    title: task.Title,
    start: new Date(task.StartDate),
    end: new Date(task.EndDate),
    extendedProps: {
      users: task.Employees.$values.join(', '),
      status: task.Status,
      taskId: task.Id,
    },
  }));

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return 'lightgray';
      case 1:
        return 'cornflowerblue';
      case 2:
        return 'greenyellow';
      case 3:
        return 'crimson';
      default:
        return '';
    }
  };

  const eventContent = (eventInfo) => {
    const eventStatusColor = getStatusColor(eventInfo.event.extendedProps.status);

    return (
      <div>
        <div
          className="custom-event-content"
          style={{ backgroundColor: eventStatusColor, cursor: 'pointer' }}
          onClick={() => handleEventClick(eventInfo)}
        >
          <div>{eventInfo.event.title} - {eventInfo.event.extendedProps.users}</div>
          <div>{eventInfo.timeText}</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: 300 }}>
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
        eventContent={eventContent}
        eventDidMount={(info) => {
          const eventEl = info.el;
          const taskStatus = info.event.extendedProps.status; 
          const eventStatusColor = getStatusColor(taskStatus);
        
          eventEl.style.cursor = 'pointer';
          eventEl.style.backgroundColor = eventStatusColor;
        }}
      />
    </div>
  );
};

export default AdminCalendar;