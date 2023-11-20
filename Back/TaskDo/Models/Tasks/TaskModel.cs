using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using TaskDo.Models.Subtask;

namespace TaskDo.Models.Tasks
{
    public class TaskModel
    {
        [Required]
        [MinLength(3), MaxLength(30)]
        public string Title { get; set; } = null!;

        public string? Description { get; set; }

        [Required]
        [DefaultValue("20/01/2023")]
        public string StartDate { get; set; }

        [Required]
        [DefaultValue("20/02/2023")]
        public string EndDate { get; set; }
        public List<SubtaskModel> Subtasks { get; set; } = new List<SubtaskModel>();
        public List<AddUserModel> Employees { get; set; } = new List<AddUserModel>();
    }
}
