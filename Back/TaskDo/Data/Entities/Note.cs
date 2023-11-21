using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskDo.Data.Entities
{
    public class Note
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Text { get; set; } = null!;

        [Required]
        [ForeignKey(nameof(Subtask))]
        public Guid SubtaskId { get; set; }
        public Subtask Subtask { get; set; }
    }
}
