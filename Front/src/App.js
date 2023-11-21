import "./App.css";

import Task from "./Layouts/Task/Task";
import Subtask from "./Layouts/SubTaskPage/Subtask";
import Header from "./Layouts/HeaderAndFooter/Header";
import Footer from "./Layouts/HeaderAndFooter/Footer";
import TaskCalendar from "./Layouts/TaskCalendar/TaskCalendar";
import TaskPanel from "./Layouts/Task/TaskPanel";

function App() {
  return (
    <div className="App">

      <Header/>
     
      <BrowserRouter>
      <Routes>
        
        {/* <Route path="/" element={<TaskList />} /> */}
        <Route path="/create" element={<TaskPanel />} />
        <Route path="/" element={<TaskCalendar />} />
        <Route path="/task/:taskId" element={<Task />} />
        <Route path="/subtask/:subtaskId" element={<Subtask />} />
      </Routes>
     
    </BrowserRouter>
   
    <Footer/>
    </div>
  );
}

export default App;
