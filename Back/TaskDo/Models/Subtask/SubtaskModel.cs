using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TaskDo.Models.Subtask
{
    public class SubtaskModel
    {
        [Required]
        [MinLength(3), MaxLength(30)]
        public string Title { get; set; } = null!;

        public string? Description { get; set; }

        [Required]
        [Range(0, 50)]
        [DefaultValue(0)]
        public int RequiredPhotosCount { get; set; }

        [Required]
        [Range(1, 100)]
        [DefaultValue(1)]
        public int RequiredNotesCount { get; set; }
    }
}
