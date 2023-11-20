using System.ComponentModel.DataAnnotations.Schema;

namespace TaskDo.Data.Entities
{
    public class EmployeeTask
    {
        [ForeignKey(nameof(Employee))]
        public string EmployeeId { get; set; }
        public Employee Employee { get; set; }

        [ForeignKey(nameof(Task))]
        public Guid TaskId { get; set; }
        public Task Task { get; set; }
    }
}
