using System.ComponentModel.DataAnnotations;
using TaskDo.Infrastructure.Entities.Enums;

namespace TaskDo.Infrastructure.Entities
{
    public abstract class User : IdentityUser
    {
        [Key]
        private int UserId { get; set; }

        [Required]
        [MinLength(3), MaxLength(16)]
        private string Username { get; set; } = null!;

        [Required]
        [EmailAddress]
        private string Email { get; set; } = null!;
        private UserTypeEnum UserType { get; set; } = 0;

        [Required]
        [DataType(DataType.Password)]
        private string Password { get; set; } = null!;
    }
}
