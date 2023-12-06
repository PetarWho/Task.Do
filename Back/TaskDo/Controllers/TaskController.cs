using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using TaskDo.Data;
using TaskDo.Data.Entities;
using TaskDo.Data.Entities.Enums;
using TaskDo.Models.Subtask;
using TaskDo.Models.Tasks;
using TaskDo.Utils;
using TaskDo.Utils.Attributes;
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
        [AuthorizeJwt]
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
                startDate = DateTime.ParseExact(taskModel.StartDate, "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture);
                endDate = DateTime.ParseExact(taskModel.EndDate, "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture);
            }
            catch (Exception)
            {
                return BadRequest("Invalid date format. Use dd/MM/yyyy HH:mm");
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
        [AuthorizeJwt]
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
        /// <param name="taskId">Task ID</param>
        /// <param name="updatedTask">Updated Task</param>
        /// <returns>200 for success or 404 if task not found or 400 for invalid model or dates</returns>
        [AuthorizeJwt]
        [HttpPut("edit")]
        public IActionResult UpdateTask(Guid taskId, TaskModel updatedTask)
        {
            var task = _context.Tasks.FirstOrDefault(x=>x.Id==taskId);

            if (task == null)
            {
                return NotFound("Task was not found");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DateTime startDate = DateTime.Now;
            DateTime endDate = DateTime.Now;

            try
            {
                startDate = DateTime.ParseExact(updatedTask.StartDate, "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture);
                endDate = DateTime.ParseExact(updatedTask.EndDate, "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture);
            }
            catch (Exception)
            {
                return BadRequest("Invalid date format. Use dd/MM/yyyy HH:mm ");
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

            var oldSubtasks = _context.Subtasks.Where(x=>x.TaskId == task.Id);
            _context.Subtasks.RemoveRange(oldSubtasks);

            foreach (var updatedSubtask in updatedTask.Subtasks)
            {
                task.Subtasks.Add(new Subtask
                {
                    Title = updatedSubtask.Title,
                    Description = updatedSubtask.Description,
                    RequiredNotesCount = updatedSubtask.RequiredNotesCount,
                    RequiredPhotosCount = updatedSubtask.RequiredPhotosCount,
                    IsFinished = false
                });
            }

            var oldAssignees = _context.EmployeesTasks.Where(x => x.TaskId == task.Id);
            _context.EmployeesTasks.RemoveRange(oldAssignees);

            foreach (var updatedAssignee in updatedTask.Employees)
            {
                task.EmployeeTasks.Add(new EmployeeTask()
                {
                    EmployeeId = updatedAssignee.EmployeeId,
                    TaskId = task.Id,
                });
            }


            _context.SaveChanges();

            return Ok("Edit Successful");
        }

        private bool CheckSameSubtasks(SubtaskModel subtask, Data.Entities.Task task)
        {
            return task.Subtasks.Any(x => x.Title == subtask.Title && x.Description == subtask.Description
            && x.RequiredNotesCount == subtask.RequiredNotesCount && x.RequiredPhotosCount == subtask.RequiredPhotosCount);
        }

        #endregion

        #region Get Tasks

        /// <summary>
        /// Get all Tasks
        /// </summary>
        /// <returns>List of Tasks</returns>
        [AuthorizeJwt]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllTasks()
        {
            var tasks = await _context.Tasks.Include(x => x.EmployeeTasks).ThenInclude(x => x.Employee)
                .OrderBy(x => x.StartDate).ToListAsync();

            foreach (var task in tasks)
            {
                if (task.Status == StatusEnum.Current && task.EndDate <= DateTime.Now)
                {
                    task.Status = StatusEnum.Uncompleted;
                }
                else if (task.Status == StatusEnum.Upcoming && task.StartDate <= DateTime.Now)
                {
                    task.Status = StatusEnum.Current;
                }
            }
            await _context.SaveChangesAsync();

            var serializedTasks = System.Text.Json.JsonSerializer.Serialize(tasks.Select(x => new
            {
                x.Id,
                x.StartDate,
                x.EndDate,
                x.Status,
                x.Title,
                Employees = x.EmployeeTasks.Select(y => y.Employee.UserName)
            }), _jsonOptions);
            return Ok(serializedTasks);
        }

        /// <summary>
        /// Get Task by ID
        /// </summary>
        /// <param name="taskId">Task ID</param>
        /// <returns>Task or 404 if Task not found</returns>
        [AuthorizeJwt]
        [HttpGet("get_by_id")]
        public async Task<IActionResult> GetTaskById(Guid taskId)
        {
            var task = await _context.Tasks.Include(x => x.Subtasks).Include(x=>x.EmployeeTasks).ThenInclude(x=>x.Employee).IgnoreAutoIncludes()
                .Select(x => new {
                x.Id,
                x.Title,
                x.Description,
                x.StartDate,
                x.EndDate,
                x.Status,
                x.Subtasks,
                Employees = x.EmployeeTasks.Select(x=>x.Employee)
            }).FirstOrDefaultAsync(x => x.Id == taskId);
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
        [AuthorizeJwt]
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
                }
                else if (task.Status == StatusEnum.Upcoming && task.StartDate <= DateTime.Now)
                {
                    task.Status = StatusEnum.Current;
                }
            }
            await _context.SaveChangesAsync();

            return Ok(tasks);
        }

        /// <summary>
        /// Get all tasks for the given Employee
        /// </summary>
        /// <returns>List of Tasks</returns>
        [AuthorizeJwt]
        [HttpGet("get_employee_tasks")]
        public async Task<IActionResult> GetEmployeeTasks()
        {
            var token = JwtUtils.JwtRetriever.GetTokenFromHeader(HttpContext.Request.Headers);

            if (token == null)
            {
                return BadRequest("Invalid Token");
            }

            var user = JwtDecoder.GetUserByToken(token, _context);

            if (user == null)
            {
                return NotFound("User was not found");
            }

            var tasks = await _context.Tasks.Where(task => task.EmployeeTasks
                .Any(employeeTask => employeeTask.EmployeeId == user.Id)).ToListAsync();

            foreach (var task in tasks)
            {
                if (task.Status == StatusEnum.Current && task.EndDate <= DateTime.Now)
                {
                    task.Status = StatusEnum.Uncompleted;
                }
                else if (task.Status == StatusEnum.Upcoming && task.StartDate <= DateTime.Now)
                {
                    task.Status = StatusEnum.Current;
                }
            }
            await _context.SaveChangesAsync();

            return Ok(tasks.Select(x => new
            {
                x.Id,
                x.Title,
                x.Description,
                x.Status,
                x.StartDate,
                x.EndDate
            }));
        }

        #endregion
    }
}
