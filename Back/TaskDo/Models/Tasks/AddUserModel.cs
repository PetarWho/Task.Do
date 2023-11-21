using System.ComponentModel.DataAnnotations;

namespace TaskDo.Models.Tasks
{
    public class AddUserModel
    {
        [Required]
        public string EmployeeId { get; set; } = null!;
    }
}
