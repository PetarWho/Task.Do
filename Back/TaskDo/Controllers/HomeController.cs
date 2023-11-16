using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
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
            context = _context;
        }

        [HttpGet("allusers")]
        public IActionResult GetAllUsers()
        {
            var users = context.Users.ToList();

            return Ok(users);
        }

        [Authorize(JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("secure")]
        public IActionResult SecureEndpoint()
        {
            return Ok("This is a secure endpoint");
        }
    }


}
