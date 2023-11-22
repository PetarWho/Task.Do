using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskDo.Data;

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
        public UsersController(ApplicationDbContext _context)
        {
            context = _context;
        }

        #endregion

        #region Get Users

        /// <summary>
        /// Get all users from database 
        /// </summary>
        /// <returns></returns>
        //[Authorize(JwtBearerDefaults.AuthenticationScheme)]
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
        [HttpGet("all_employees")]
        public IActionResult GetAllEmployees()
        {
            var users = context.Users.Where(x=>x.UserType == Data.Entities.Enums.UserTypeEnum.Employee).ToList();

            return Ok(users);
        }

        /// <summary>
        /// Get all managers from database
        /// </summary>
        /// <returns>List of managers</returns>
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
        [HttpGet("get_by_id")]
        public async Task<IActionResult> GetUserById(string userId)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null)
                return NotFound("User not found");

            return Ok(user);
        }

        #endregion
    }
}
