using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TaskDo.Data.Entities;

namespace TaskDo.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public DbSet<TaskDo.Data.Entities.Task> Tasks { get; set; }
        public DbSet<Subtask> Subtasks { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Manager> Managers { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<Picture> Pictures { get; set; }
        public DbSet<EmployeeTask> EmployeesTasks { get; set; }
        public DbSet<JsonWebToken> JsonWebTokens { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder
                   .UseSqlServer();
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<EmployeeTask>()
                .HasKey(et => new { et.EmployeeId, et.TaskId });

            base.OnModelCreating(builder);
        }
    }
}
