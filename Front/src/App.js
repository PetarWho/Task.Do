import "./App.css";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import TaskList from "./components/TaskList";
import Task from "./components/Task";
import Subtask from "./components/Subtask";

function App() {
  return (
    <div className="App">
      <Header></Header>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/task/:taskId" element={<Task />} />
        <Route path="/subtask/:subtaskId" element={<Subtask />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
