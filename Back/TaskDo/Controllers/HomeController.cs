using Microsoft.AspNetCore.Mvc;
using TaskDo.Data;

namespace TaskDo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        public HomeController(ApplicationDbContext _context)
        {
            context= _context;
        }

        [HttpGet("allusers")]
        public IActionResult GetAllUsers()
        {
            var users = context.Users.ToList();

            return Ok(users);
        }
    }
}
