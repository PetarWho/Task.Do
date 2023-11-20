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
        public List<Note> Notes { get; set; } = new List<Note>();
        public List<Picture> Images { get; set; } = new List<Picture>();

        [Required]
        [Range(0, 50)]
        public int RequiredPhotosCount { get; set; }

        [Required]
        [Range(1, 100)]
        public int RequiredNotesCount { get; set; }

        public bool IsFinished { get; set; } = false;

        [Required]
        [ForeignKey(nameof(Task))]
        public Guid TaskId { get; set; }
        public Task Task { get; set; } = null!;

        [ForeignKey(nameof(User))]
        public string? UserId { get; set; }
        public User? User { get; set; } 
    }
}
