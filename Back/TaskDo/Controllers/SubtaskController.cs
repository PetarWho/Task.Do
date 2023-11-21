using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using TaskDo.Data;
using TaskDo.Data.Entities;
using TaskDo.Models.Subtask;

namespace TaskDo.Controllers
{
    [ApiController]
    [Route("api/subtasks")]
    public class SubtaskController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JsonSerializerOptions _jsonOptions;

        public SubtaskController(ApplicationDbContext context)
        {
            _context = context;
            _jsonOptions = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve, // Handle reference loops
                WriteIndented = true
            };
        }

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

        [HttpGet("all")]
        public async Task<IActionResult> GetAllSubtasksForTask(Guid taskId)
        {
            var subtasks = await _context.Subtasks.Where(x=>x.TaskId == taskId).ToListAsync();
            if (subtasks == null)
            {
                return NotFound("No such task");
            }
            return Ok(subtasks);
        }

        [HttpGet("get_by_id")]
        public async Task<IActionResult> GetSubtaskById(Guid subtaskId)
        {
            var subtask = await _context.Subtasks.Include(x=>x.Notes).Include(x=>x.Images)
                             .Include(x=>x.Task)
                             .FirstOrDefaultAsync(x => x.Id == subtaskId);
            if (subtask == null)
            {
                return NotFound("No such subtask");
            }
            var serializedTask = JsonSerializer.Serialize(subtask, _jsonOptions);
            return Ok(serializedTask);
        }
    }
}