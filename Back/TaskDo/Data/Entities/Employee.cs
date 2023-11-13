namespace TaskDo.Data.Entities
{
    public class Employee : User
    {
        public bool IsAvailable { get; set; } = true;
        public List<EmployeeTask> EmployeeTasks { get; set; } = new List<EmployeeTask>();

        public List<Subtask> Subtasks { get; set; } = new List<Subtask>();
    }
}
