using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;
using TaskDo.Data;
using TaskDo.Data.Entities;
using TaskDo.Models.Subtask;
using TaskDo.Utils.Attributes;
using TaskDo.Utils.Drive;

namespace TaskDo.Controllers
{
    /// <summary>
    /// Controller for managing Subtasks
    /// </summary>
    [ApiController]
    [Route("api/subtasks")]
    public class SubtaskController : ControllerBase
    {
        #region Injection

        private readonly ApplicationDbContext _context;
        private readonly JsonSerializerOptions _jsonOptions;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public SubtaskController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _jsonOptions = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve, // Handle reference loops
                WriteIndented = true
            };
            _webHostEnvironment = webHostEnvironment;
        }

        #endregion

        #region Edit

        /// <summary>
        /// Action for editing subtasks
        /// </summary>
        /// <param name="id">Subtask ID</param>
        /// <param name="updatedSubtask">The updated subtask</param>
        /// <returns>200 if edit is successful or 404 if subtask not found</returns>
        [AuthorizeJwt]
        [HttpPut("edit")]
        public IActionResult UpdateSubtask(Guid id, SubtaskModel updatedSubtask)
        {
            var subtask = _context.Subtasks.Find(id);

            if (subtask == null)
            {
                return NotFound();
            }

            subtask.Title = updatedSubtask.Title;
            subtask.Description = updatedSubtask.Description;
            subtask.RequiredPhotosCount = updatedSubtask.RequiredPhotosCount;
            subtask.RequiredNotesCount = updatedSubtask.RequiredNotesCount;

            _context.SaveChanges();

            return Ok("Edit Successful");
        }

        #endregion

        #region Delete

        /// <summary>
        /// Action for deleting a subtask
        /// </summary>
        /// <param name="id">Subtask ID</param>
        /// <returns>204 if deletion is successful or 404 if subtask not found</returns>
        [AuthorizeJwt]
        [HttpDelete("delete")]
        public IActionResult DeleteSubtask(Guid id)
        {
            var subtask = _context.Subtasks.Find(id);

            if (subtask == null)
            {
                return NotFound();
            }

            _context.Subtasks.Remove(subtask);
            _context.SaveChanges();

            return NoContent();
        }

        #endregion

        #region Get Subtasks

        /// <summary>
        /// Get all subtask for given task
        /// </summary>
        /// <param name="taskId">Given task ID</param>
        /// <returns>List of Subtasks or 404 if taskId is invalid</returns>
        [AuthorizeJwt]
        [HttpGet("all")]

        public async Task<IActionResult> GetAllSubtasksForTask(Guid taskId)
        {
            if (!await _context.Tasks.AnyAsync(x => x.Id == taskId))
            {
                return NotFound("No such task");
            }

            var subtasks = await _context.Subtasks.Include(x => x.Notes).Include(x => x.Images).Where(x => x.TaskId == taskId)
                .Select(x => new
                {
                    x.Id,
                    x.Title,
                    x.RequiredNotesCount,
                    x.RequiredPhotosCount,
                    x.IsFinished,
                    NotesCount = x.Notes.Count(),
                    PhotosCount = x.Images.Count()
                }).ToListAsync();
            return Ok(subtasks);
        }

        /// <summary>
        /// Get subtask by ID
        /// </summary>
        /// <param name="subtaskId">Subtask ID</param>
        /// <returns>Subtask if found or 404 if not found</returns>
        [AuthorizeJwt]
        [HttpGet("get_by_id")]
        public async Task<IActionResult> GetSubtaskById(Guid subtaskId)
        {
            var subtask = await _context.Subtasks.Include(x => x.Notes).Include(x => x.Images)
                             .Include(x => x.Task)
                             .FirstOrDefaultAsync(x => x.Id == subtaskId);
            if (subtask == null)
            {
                return NotFound("No such subtask");
            }
            var serializedTask = JsonSerializer.Serialize(subtask, _jsonOptions);
            Console.WriteLine("Subtask Notes: " + string.Join(", ", subtask.Notes?.Select(n => n.Text)));
            Console.WriteLine("Subtask Images: " + string.Join(", ", subtask.Images?.Select(i => i.URL)));
            await Console.Out.WriteLineAsync(serializedTask);

            return Ok(serializedTask);
        }

        #endregion

        #region Subtask Image

        /// <summary>
        /// Add image to Subtask
        /// </summary>
        /// <param name="subtaskId">Subtask ID</param>
        /// <returns>200 for success or 404 if Subtask is not found</returns>
        [AuthorizeJwt]
        [HttpPost("add_image")]
        public async Task<IActionResult> AddImageToSubtask(Guid subtaskId)
        {
            var subtask = await _context.Subtasks.Include(x => x.Images).Include(x => x.Notes).Include(x => x.Task).FirstOrDefaultAsync(x => x.Id == subtaskId);

            if (subtask == null)
            {
                return NotFound("Subtask not found");
            }
            try
            {
                CheckTaskStatus(subtask.Task);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }

            try
            {
                var image = new Picture
                {
                    SubtaskId = subtaskId
                };

                byte[] imageData;
                using (MemoryStream ms = new MemoryStream())
                {
                    await Request.Body.CopyToAsync(ms);
                    imageData = ms.ToArray();
                }

                if (Request.ContentType == null)
                {
                    return BadRequest("Invalid ContentType");
                }

                var fileExtension = GetFileExtension(Request.ContentType);
                var fileName = $"{Guid.NewGuid()}{fileExtension}";

                var imagePath = Path.Combine("Images", fileName);

                var contentRootPath = _webHostEnvironment.ContentRootPath;

                var imagesFolderPath = Path.Combine(contentRootPath, "Images");
                if (!Directory.Exists(imagesFolderPath))
                {
                    Directory.CreateDirectory(imagesFolderPath);
                }

                // Save the image file to the content root/Images folder
                var physicalPath = Path.Combine(contentRootPath, imagePath);
                await System.IO.File.WriteAllBytesAsync(physicalPath, imageData);

                var imageUrl = GoogleDriveUtils.UploadImageToDrive(contentRootPath, fileName);
                image.URL = imageUrl;

                _context.Pictures.Add(image);

                try
                {
                    if (subtask.Task == null)
                    {
                        throw new ArgumentException("Task associated with this subtask not found");
                    }
                    CheckCompletion(subtask);
                }
                catch (ArgumentException ex)
                {
                    return BadRequest(ex.Message);
                }

                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private string GetFileExtension(string contentType)
        {
            switch (contentType)
            {
                case "image/jpeg":
                    return ".jpg";
                case "image/png":
                    return ".png";
                default:
                    return ".jpg";
            }
        }

        #endregion

        #region Subtask Note

        /// <summary>
        /// Add Note to Subtask
        /// </summary>
        /// <param name="subtaskId">Subtask ID</param>
        /// <param name="noteText">Note as string</param>
        /// <returns>200 for success or 404 if Subtask is not found</returns>
        [AuthorizeJwt]
        [HttpPost("add_note")]
        public async Task<IActionResult> AddNoteToSubtask(Guid subtaskId, string noteText)
        {
            var subtask = await _context.Subtasks.Include(x => x.Images).Include(x => x.Notes).Include(x => x.Task).FirstOrDefaultAsync(x => x.Id == subtaskId);
            if (subtask == null)
            {
                return NotFound("Subtask not found");
            }
            try
            {
                CheckTaskStatus(subtask.Task);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }

            var note = new Note()
            {
                SubtaskId = subtaskId,
                Text = noteText
            };

            await _context.AddAsync(note);
            try
            {
                if (subtask.Task == null)
                {
                    throw new ArgumentException("Task associated with this subtask not found");
                }
                CheckCompletion(subtask);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            await _context.SaveChangesAsync();
            return Ok();
        }

        #endregion

        #region Check Subtask

        private void CheckCompletion(Subtask subtask)
        {
            if (subtask.Images.Count() >= subtask.RequiredPhotosCount && subtask.Notes.Count() >= subtask.RequiredNotesCount)
            {
                subtask.IsFinished = true;
                if (subtask.Task != null && subtask.Task.Subtasks.All(x => x.IsFinished))
                {
                    subtask.Task.Status = Data.Entities.Enums.StatusEnum.Completed;
                }
            }
        }

        private void CheckTaskStatus(Data.Entities.Task task)
        {
            if (task.Status == Data.Entities.Enums.StatusEnum.Uncompleted)
            {
                throw new ArgumentException("Task was not completed in time, you cannot add a note!");
            }
            else if (task.Status == Data.Entities.Enums.StatusEnum.Completed)
            {
                throw new ArgumentException("Task has been completed, you cannot add more notes!");
            }
            else if (task.Status == Data.Entities.Enums.StatusEnum.Upcoming)
            {
                throw new ArgumentException("Task hasn't started yet, you cannot add a note!");
            }
        }

        #endregion
    }
}