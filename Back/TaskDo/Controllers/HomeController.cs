using Microsoft.AspNetCore.Mvc;

namespace TaskDo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Hello from HomeController!");
        }
    }
}
