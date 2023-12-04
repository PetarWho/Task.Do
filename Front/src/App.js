import "./App.css";

import Task from "./Layouts/Task/Task";
import Subtask from "./Layouts/SubTaskPage/Subtask";
import Header from "./Layouts/HeaderAndFooter/Header";
import Footer from "./Layouts/HeaderAndFooter/Footer";
import TaskCalendar from "./Layouts/TaskCalendar/TaskCalendar";
import AdminTasks from "./Layouts/AdminPanel/AdminTasks";
import CreateTask from "./Layouts/AdminPanel/CreateTask";
import CreateSubtask from "./Layouts/AdminPanel/CreateSubTask";
import AdminCalendar from "./Layouts/AdminPanel/AdminTaskCalendar";
import RegistrationForm from "./Layouts/RegistrationForm";
import LoginForm from "./Layouts/LoginForm";
import PrivateRoutes from "./Layouts/Utils/PrivateRoutes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Layouts/Home/Home";
import Profile from "./Layouts/Profile/Profile";

function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route element={<PrivateRoutes/>}>
          <Route path="/createTask" element={<CreateTask />} />
          <Route path="/calendar" element={<TaskCalendar />} />
          <Route path="/adminCalendar" element={<AdminCalendar />} />
          <Route path="/adminTasks" element={<AdminTasks />} />
          <Route path="/task/:taskId" element={<Task />} />
          <Route path="/subtask/:subtaskId" element={<Subtask />} />
          <Route path="/profile/:uid?" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Footer />

    </div>
  );
}

export default App;