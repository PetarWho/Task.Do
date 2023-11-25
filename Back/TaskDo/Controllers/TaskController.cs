using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using TaskDo.Data;
using TaskDo.Data.Entities;
using TaskDo.Data.Entities.Enums;
using TaskDo.Models.Tasks;
using static TaskDo.Utils.JwtUtils;

namespace TaskDo.Controllers
{
    /// <summary>
    /// Controller for managing Tasks
    /// </summary>
    [ApiController]
    [Route("api/tasks")]
    public class TaskController : ControllerBase
    {
        #region Injection

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

        #endregion

        #region Create

        /// <summary>
        /// Action for creating Tasks
        /// </summary>
        /// <param name="taskModel">Task Model</param>
        /// <returns>200 for success or 400 for model errors and incorrect dates</returns>
        [HttpPost("create")]
        [Authorize]
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

        #endregion

        #region Delete

        /// <summary>
        /// Action for deleting Tasks
        /// </summary>
        /// <param name="id">Task ID</param>
        /// <returns>204 for successful deletion or 404 if Task not found</returns>
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

        #endregion

        #region Edit

        /// <summary>
        /// Action for editing Tasks
        /// </summary>
        /// <param name="id">Task ID</param>
        /// <param name="updatedTask">Updated Task</param>
        /// <returns>200 for success or 404 if task not found or 400 for invalid model or dates</returns>
        [HttpPut("edit")]
        public IActionResult UpdateTask(Guid id, TaskModel updatedTask)
        {
            var task = _context.Tasks.Find(id);

            if (task == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
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

        #endregion

        #region Get Tasks

        /// <summary>
        /// Get all Tasks (TEST PURPOSES ONLY... use get_n_per_page instead)
        /// </summary>
        /// <returns>List of Tasks</returns>
        [HttpGet("all")]
        public IActionResult GetAllTasks()
        {
            var tasks = _context.Tasks.OrderBy(x => x.StartDate).ToList();
            return Ok(tasks);
        }

        /// <summary>
        /// Get Task by ID
        /// </summary>
        /// <param name="taskId">Task ID</param>
        /// <returns>Task or 404 if Task not found</returns>
        [HttpGet("get_by_id")]
        public async Task<IActionResult> GetTaskById(Guid taskId)
        {
            var task = await _context.Tasks.Include(x => x.Subtasks).IgnoreAutoIncludes().FirstOrDefaultAsync(x => x.Id == taskId);
            if (task == null)
            {
                return NotFound("No such task");
            }

            var serializedTask = System.Text.Json.JsonSerializer.Serialize(task, _jsonOptions);
            return Ok(serializedTask);
        }

        /// <summary>
        /// Retrieves tasks based on pagination.
        /// </summary>
        /// <param name="numberOfTasksPerPage">Number of tasks per page.</param>
        /// <param name="page">Current page number for pagination.</param>
        /// <param name="order">Optional. Order of the tasks (0 - by StartDate, 1 - by EndDate).</param>
        /// <returns>Returns tasks based on pagination.</returns>
        [HttpGet("get_n_per_page")]
        public async Task<IActionResult> GetTasksPerPage(int numberOfTasksPerPage, int page, byte? order = 0)
        {
            var tasks = new List<Data.Entities.Task>();
            switch (order)
            {
                default:
                case 0:
                    tasks = await _context.Tasks.OrderBy(x => x.StartDate).Skip((page - 1) * numberOfTasksPerPage).Take(numberOfTasksPerPage).ToListAsync();
                    break;
                case 1:
                    tasks = await _context.Tasks.OrderBy(x => x.EndDate).Skip((page - 1) * numberOfTasksPerPage).Take(numberOfTasksPerPage).ToListAsync();
                    break;
            }

            foreach (var task in tasks)
            {
                if (task.Status == StatusEnum.Current && task.EndDate <= DateTime.Now)
                {
                    task.Status = StatusEnum.Uncompleted;
                    await _context.SaveChangesAsync();
                }
            }

            return Ok(tasks);
        }

        /// <summary>
        /// Get all tasks for the given Employee
        /// </summary>
        /// <param name="token">The token of the emoployee</param>
        /// <returns>List of Tasks</returns>
        [Authorize]
        [HttpGet("get_employee_tasks")]
        public IActionResult GetEmployeeTasks()
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();

            if (authHeader == null || !authHeader.StartsWith("Bearer "))
            {
                return BadRequest("Invalid authorization header");
            }

            var token = authHeader.Substring("Bearer ".Length).Trim();

            var user = JwtDecoder.GetUserByToken(token, _context);
            var tasks = _context.Tasks.Where(task => task.EmployeeTasks
                .Any(employeeTask => employeeTask.EmployeeId == user.Id)).Select(x => new
                {
                    x.Id, x.Title, x.Description, x.Status, x.StartDate, x.EndDate
                }).ToList();

            return Ok(tasks);
        }

        #endregion
    }
}
