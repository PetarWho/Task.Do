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

function App() {
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
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
