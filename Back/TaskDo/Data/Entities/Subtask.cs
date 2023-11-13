using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskDo.Data.Entities
{
    public class Subtask
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MinLength(3), MaxLength(30)]
        public string Title { get; set; } = null!;

        public string? Description { get; set; }
        public List<string> Notes { get; set; } = new List<string>();

        // Saving as URL or Bitmap or byte[] ??
        public List<string> Images { get; set; } = new List<string>();

        [Required]
        [Range(0, 50)]
        public int RequiredPhotosCount { get; set; }

        [Required]
        [Range(1, 100)]
        public int RequiredNotesCount { get; set; }

        public bool IsFinished { get; set; } = false;

        [Required]
        [ForeignKey(nameof(Task))]
        public int TaskId { get; set; }
        public Task Task { get; set; } = null!;

        [Required]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
