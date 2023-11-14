using System.ComponentModel.DataAnnotations;

namespace TaskDo.Data.Entities
{
    public class Note
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Text { get; set; } = null!;
    }
}
