namespace TaskDo.Models.Users
{
    public class ProfileModel
    {
        public string UserId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? ImageURL { get; set; }
        public string UserType { get; set; } = null!;
        public int FinishedSubtasks { get; set; }
        public int PartOfTasks { get; set; }
    }
}
