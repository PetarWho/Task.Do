using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskDo.Data;

namespace TaskDo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        public UsersController(ApplicationDbContext _context)
        {
            context = _context;
        }

        //[Authorize(JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("all")]
        public IActionResult GetAllUsers()
        {
            var users = context.Users.ToList();

            return Ok(users);
        }

        [HttpGet("all_employees")]
        public IActionResult GetAllEmployees()
        {
            var users = context.Users.Where(x=>x.UserType == Data.Entities.Enums.UserTypeEnum.Employee).ToList();

            return Ok(users);
        }

        [HttpGet("all_managers")]
        public IActionResult GetAllManagers()
        {
            var users = context.Users.Where(x => x.UserType == Data.Entities.Enums.UserTypeEnum.Manager).ToList();

            return Ok(users);
        }

        [HttpGet("get_by_name")]
        public IActionResult GetUserByName(string name)
        {
            var users = context.Users.Where(x => x.UserName == name).ToList();

            return Ok(users);
        }

        [HttpGet("get_by_id")]
        public async Task<IActionResult> GetUserById(string userId)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.Id == userId);

            return Ok(user);
        }
    }
}
