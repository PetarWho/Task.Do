using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskDo.Data.Entities
{
    public class JsonWebToken
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]  // Will not auto-generate ID
        public string Token { get; set; }

        [Required]
        public DateTime ExpiryDate { get; set; }

        [Required]
        [ForeignKey(nameof(User))]
        public string UserId { get; set; }
        public User User { get; set; }
    }
}
