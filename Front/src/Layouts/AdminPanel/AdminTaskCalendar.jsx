import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import './styleCalendar.css'

const AdminCalendar = () => {
    const tasks = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          start: new Date().setHours(9, 0, 0, 0),
          end: new Date().setHours(10, 0, 0, 0),
          users: ['Alice', 'Bob', 'Charlie']
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Description 2',
          start: new Date().setHours(12, 0, 0, 0),
          end: new Date().setHours(13, 0, 0, 0),
          users: ['Simona', 'Peter', 'Veselin']
        },
        {
          id: 3,
          title: 'Task 3',
          description: 'Description 3',
          start: new Date().setHours(17, 0, 0, 0),
          end: new Date().setHours(18, 0, 0, 0),
          users: ['Ivan', 'Georgi', 'Dimitar']
        },
      ];

  const navigate = useNavigate();

  const handleEventClick = (clickedInfo) => {
    const clickedEvent = clickedInfo.event;
    const clickedStartTime = clickedEvent.start.getTime();
    const clickedEndTime = clickedEvent.end.getTime();
  
    const selectedTask = tasks.find(
      (task) =>
        new Date(task.start).getTime() === clickedStartTime &&
        new Date(task.end).getTime() === clickedEndTime
    );
  
    if (selectedTask) {
      navigate(`/task/${clickedEvent.id}`, { state: { task: selectedTask } });
    }
  };
  
  const events = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: new Date(task.start),
    end: new Date(task.end),
    extendedProps: {
      users: task.users.join(', ')
    }
  }));

  const eventContent = (eventInfo) => {
    return (
      <>
        <div className="custom-event-content">
      <div>{eventInfo.event.title}</div>
      <div>{eventInfo.timeText}</div>
      <div>{eventInfo.event.extendedProps.users}</div>
    </div>
      </>
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
          const eventEls = document.querySelectorAll('.fc-event');
          eventEls.forEach((el) => {
            el.style.cursor = 'pointer';
          });
        }}
      />
    </div>
  );
};

export default AdminCalendar;