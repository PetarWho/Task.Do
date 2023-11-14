using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskDo.Data.Entities
{
    public class Picture
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string URL { get; set; } = null!;

        [ForeignKey(nameof(Subtask))]
        public Guid SubtaskId { get; set; }
        public Subtask Subtask { get; set; }
    }
}
