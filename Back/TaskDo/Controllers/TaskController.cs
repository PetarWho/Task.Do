using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
using TaskDo.Data;
using TaskDo.Data.Entities;
using TaskDo.Data.Entities.Enums;
using TaskDo.Models.Tasks;

namespace TaskDo.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    public class TaskController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JsonSerializerOptions _jsonOptions;
        public TaskController(ApplicationDbContext context)
        {
            _context = context;
            _jsonOptions = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve, // Handle reference loops
                WriteIndented = true
            };
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateTask(TaskModel taskModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DateTime startDate = DateTime.Now;
            DateTime endDate = DateTime.Now;

            try
            {
                startDate = DateTime.ParseExact(taskModel.StartDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                endDate = DateTime.ParseExact(taskModel.EndDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
            }
            catch (Exception ex)
            {
                return BadRequest("Invalid date format. Use dd/MM/yyyy");
            }

            int status = 0;

            if (startDate >= endDate)
            {
                return BadRequest("Start date cannot be after end date");
            }
            else if (startDate > DateTime.Now)
            {
                status = 0;
            }
            else if (startDate <= DateTime.Now)
            {
                status = 1;
            }
            

            try
            {
                var task = new Data.Entities.Task()
                {
                    Title = taskModel.Title,
                    Description = taskModel.Description,
                    StartDate = startDate,
                    EndDate = endDate,
                    Status = (StatusEnum)status
                };

                var empTasks = new List<EmployeeTask>();
                foreach (var emp in taskModel.Employees)
                {
                    empTasks.Add(new EmployeeTask()
                    {
                        Task = task,
                        EmployeeId = emp.EmployeeId
                    });
                }

                var subtasks = new List<Subtask>();
                foreach (var sub in taskModel.Subtasks)
                {
                    subtasks.Add(new Subtask()
                    {
                        Title = sub.Title,
                        Description = sub.Description,
                        Task = task,
                        RequiredNotesCount = sub.RequiredNotesCount,
                        RequiredPhotosCount = sub.RequiredPhotosCount,
                    });
                }

                _context.Tasks.Add(task);
                _context.AddRange(subtasks);
                _context.AddRange(empTasks);
                await _context.SaveChangesAsync();

                return Ok("Task created successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpDelete("delete")]
        public IActionResult DeleteTask(Guid id)
        {
            var task = _context.Tasks.Find(id);

            if (task == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(task);
            _context.SaveChanges();

            return NoContent(); 
        }

        [HttpPut("edit")]
        public IActionResult UpdateTask(Guid id, TaskModel updatedTask)
        {
            var task = _context.Tasks.Find(id);

            if (task == null)
            {
                return NotFound();
            }

            DateTime startDate = DateTime.Now;
            DateTime endDate = DateTime.Now;

            try
            {
                startDate = DateTime.ParseExact(updatedTask.StartDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                endDate = DateTime.ParseExact(updatedTask.EndDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
            }
            catch (Exception ex)
            {
                return BadRequest("Invalid date format. Use dd/MM/yyyy");
            }

            int status = 0;

            if (startDate >= endDate)
            {
                return BadRequest("Start date cannot be after end date");
            }
            else if (startDate > DateTime.Now)
            {
                status = 0;
            }
            else if (startDate <= DateTime.Now)
            {
                status = 1;
            }

            task.Title = updatedTask.Title;
            task.Description = updatedTask.Description;
            task.StartDate = startDate;
            task.EndDate = endDate;
            task.Status = (StatusEnum)status;

            _context.SaveChanges();

            return Ok("Edit Successful"); 
        }

        [HttpGet("all")]
        public IActionResult GetAllTasks()
        {
            var tasks = _context.Tasks.OrderBy(x => x.StartDate).ToList();
            return Ok(tasks);
        }

        [HttpGet("get_by_id")]
        public async Task<IActionResult> GetTaskById(Guid taskId)
        {
            var task = await _context.Tasks.Include(x => x.Subtasks).IgnoreAutoIncludes().FirstOrDefaultAsync(x => x.Id == taskId);
            if (task == null)
            {
                return NotFound("No such task");
            }

            var serializedTask = JsonSerializer.Serialize(task, _jsonOptions);
            return Ok(serializedTask);
        }
    }
}
