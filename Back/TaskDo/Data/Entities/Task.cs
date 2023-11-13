using System.ComponentModel.DataAnnotations;
using TaskDo.Data.Entities.Enums;

namespace TaskDo.Data.Entities
{
    public class Task
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MinLength(3), MaxLength(30)]
        public string Title { get; set; } = null!;

        public string? Description { get; set; }
        public StatusEnum Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<Subtask> Subtasks { get; set; } = new List<Subtask>();
        public List<EmployeeTask> EmployeeTasks { get; set; } = new List<EmployeeTask>();
    }
}
