using System.ComponentModel.DataAnnotations;
using TaskDo.Data.Entities.Enums;

namespace TaskDo.Models
{
    public class RegisterModel
    {
        [Required]
        public string Username { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
    }
}
