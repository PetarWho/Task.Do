using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskDo.Data;
using TaskDo.Data.Entities;
using TaskDo.Data.Entities.Enums;
using TaskDo.Models.Users;
using TaskDo.Utils;
using TaskDo.Utils.Attributes;
using TaskDo.Utils.Drive;
using static TaskDo.Utils.JwtUtils;

namespace TaskDo.Controllers
{
    /// <summary>
    /// Controller for managing users 
    /// </summary>

    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        #region Injection
        private readonly ApplicationDbContext context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public UsersController(ApplicationDbContext _context, IWebHostEnvironment webHostEnvironment)
        {
            context = _context;
            _webHostEnvironment = webHostEnvironment;
        }

        #endregion

        #region Get Users

        /// <summary>
        /// Get all users from database 
        /// </summary>
        /// <returns>List of Users</returns>
        [AuthorizeJwt]
        [HttpGet("all")]
        public IActionResult GetAllUsers()
        {
            var users = context.Users.ToList();

            return Ok(users);
        }

        /// <summary>
        /// Get all employees from database
        /// </summary>
        /// <returns>List of employees</returns>
        [AuthorizeJwt]
        [HttpGet("all_employees")]
        public IActionResult GetAllEmployees()
        {
            var users = context.Users.Where(x => x.UserType == Data.Entities.Enums.UserTypeEnum.Employee).ToList();

            return Ok(users);
        }

        /// <summary>
        /// Get all managers from database
        /// </summary>
        /// <returns>List of managers</returns>
        [AuthorizeJwt]
        [HttpGet("all_managers")]
        public IActionResult GetAllManagers()
        {
            var users = context.Users.Where(x => x.UserType == Data.Entities.Enums.UserTypeEnum.Manager).ToList();

            return Ok(users);
        }

        /// <summary>
        /// Get employees by name or containing substring
        /// </summary>
        /// <param name="name">Name or substring</param>
        /// <returns>List of Employees</returns>
        [AuthorizeJwt]
        [HttpGet("get_by_name")]
        public IActionResult GetUserByName(string name)
        {
            var employees = context.Employees.Where(x => x.UserName.ToLower().Contains(name.ToLower())).ToList();

            return Ok(employees);
        }

        /// <summary>
        /// Get user by ID
        /// </summary>
        /// <param name="userId">User's ID</param>
        /// <returns>User if found or 404 if not</returns>
        [AuthorizeJwt]
        [HttpGet("get_by_id")]
        public async Task<IActionResult> GetUserById(string userId)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null)
                return NotFound("User not found");

            return Ok(user);
        }


        /// <summary>
        /// Get user by token
        /// </summary>
        /// <returns>User</returns>
        [AuthorizeJwt]
        [HttpGet("get_by_token")]
        public IActionResult GetUserByToken()
        {
            var token = JwtRetriever.GetTokenFromHeader(HttpContext.Request.Headers);
            if (token == null) return NotFound("Token was not found");

            var user = JwtDecoder.GetUserByToken(token, context);
            if (user == null) return NotFound("User was not found");

            return Ok(user);

        }

        /// <summary>
        /// Get User role by token
        /// </summary>
        /// <returns>Role as string</returns>
        [AuthorizeJwt]
        [HttpGet("get_role")]
        public IActionResult GetUserRoleByToken()
        {
            var token = JwtRetriever.GetTokenFromHeader(HttpContext.Request.Headers);
            if (token == null) return NotFound("Token was not found");

            var decoded = JwtDecoder.GetTokenAsDictionary(token);

            return Ok(decoded["role"]);

        }

        #endregion

        #region Profile

        /// <summary>
        /// Get User's profile
        /// </summary>
        /// <param name="uid">User Id</param>
        /// <returns>ProfileModel or 404</returns>
        [AuthorizeJwt]
        [HttpGet("profile")]
        public async Task<IActionResult> GetUserProfile(string? uid)
        {
            var token = JwtRetriever.GetTokenFromHeader(HttpContext.Request.Headers);
            if (token == null) return NotFound("Token was not found");
            var user = JwtDecoder.GetUserByToken(token, context);
            if (!string.IsNullOrEmpty(uid))
            {
                user = await context.Users.FindAsync(uid);
            }
            if (user == null) return NotFound("User was not found");

            var tasks = await context.Tasks.Include(x => x.EmployeeTasks).AsNoTracking().Select(x => x.EmployeeTasks.Any(et => et.EmployeeId == user.Id)).CountAsync();
            var finishedSubtasks = await context.Subtasks.AsNoTracking().Where(x => x.UserId == user.Id).Where(x => x.IsFinished == true).CountAsync();
            var model = new ProfileModel()
            {
                UserId = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                ImageURL = user.ImageURL,
                UserType = user.UserType == 0 ? "Employee" : "Manager",
                FinishedSubtasks = finishedSubtasks,
                PartOfTasks = tasks
            };
            return Ok(model);
        }

        /// <summary>
        /// Change User's profile picture
        /// </summary>
        /// <returns>Status 200, 400 or 404</returns>
        [AuthorizeJwt]
        [HttpPost("change_image")]
        public async Task<IActionResult> ChangeUserImage()
        {
            var token = JwtRetriever.GetTokenFromHeader(HttpContext.Request.Headers);
            if (token == null)
            {
                return BadRequest("Invalid Token");
            }

            var user = JwtDecoder.GetUserByToken(token, context);
            if (user == null)
            {
                return NotFound("User not found");
            }

            try
            {
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

                var fileExtension = FileUtils.GetFileExtension(Request.ContentType);
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
                user.ImageURL = imageUrl;
                
                await context.SaveChangesAsync();
                return Ok(imageUrl);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        #endregion
    }
}
