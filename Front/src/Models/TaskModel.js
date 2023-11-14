class TaskModel {
    constructor(id, title, description, status, startDate, endDate, subtasks, employeeTasks) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.status = status;
      this.startDate = startDate;
      this.endDate = endDate;
      this.subtasks = subtasks || []; 
      this.employeeTasks = employeeTasks || []; 
    }
  }
  
  export default TaskModel;
  