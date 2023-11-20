import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskList from "./Layouts/AllTasks/TaskList";
import Task from "./Layouts/Task/Task";
import Subtask from "./Layouts/SubTaskPage/Subtask";
import Header from "./Layouts/HeaderAndFooter/Header";
import Footer from "./Layouts/HeaderAndFooter/Footer";
import TaskCalendar from "./Layouts/TaskCalendar/TaskCalendar";
import AdminTasks from "./Layouts/AdminPanel/AdminTasks";
import CreateTask from "./Layouts/AdminPanel/CreateTask";
import CreateSubtask from "./Layouts/AdminPanel/CreateSubTask";
import AdminCalendar from "./Layouts/AdminPanel/AdminTaskCalendar";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          {/* <Route path="/" element={<TaskList />} /> */}
          {/* <Route path="/" element={<TaskCalendar />} /> */}
          <Route path="/" element={<AdminCalendar />} />
          <Route path="/adminTasks" element={<AdminTasks />} />
          <Route path="/createTask" element={<CreateTask />} />
          <Route path="/createSubtask" element={<CreateSubtask />} />
          <Route path="/task/:taskId" element={<Task />} />
          <Route path="/subtask/:subtaskId" element={<Subtask />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
