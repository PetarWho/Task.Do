using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TaskDo.Data;
using TaskDo.Data.Entities;
using TaskDo.Data.Entities.Enums;
using TaskDo.Models;
using TaskDo.Utils;

namespace TaskDo.Controllers
{

    /// <summary>
    /// Controller for managing user accounts
    /// </summary>

    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        #region Injection

        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ApplicationDbContext _context;
        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
        }

        #endregion

        #region Register

        /// <summary>
        /// Action for register of Employee
        /// </summary>
        /// <param name="model">RegisterModel</param>
        /// <returns>JWT for success or BadRequest for error</returns>

        [HttpPost("register/employee")]
        public async Task<IActionResult> RegisterEmployee(RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            User user = new Employee
            {
                UserName = model.Username,
                Email = model.Email,
                UserType = UserTypeEnum.Employee,
                IsAvailable = true
            };


            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                var token = JwtUtils.JwtEncoder.GenerateJwtToken(user, UserTypeEnum.Employee.ToString(), _context);
                return Ok(new { Token = token });
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        /// <summary>
        /// Action for register of Manager
        /// </summary>
        /// <param name="model">RegisterModel</param>
        /// <returns>JWT for success or BadRequest for error</returns>

        [HttpPost("register/manager")]
        public async Task<IActionResult> RegisterManager(RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            User user = new Manager
            {
                UserName = model.Username,
                Email = model.Email,
                UserType = UserTypeEnum.Manager
            };



            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                var token = JwtUtils.JwtEncoder.GenerateJwtToken(user, UserTypeEnum.Manager.ToString().ToLower(), _context);
                return Ok(new { Token = token });
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        #endregion

        #region Login

        /// <summary>
        /// Action for logging in
        /// </summary>
        /// <param name="model">LoginModel</param>
        /// <returns>JWT for success or BadRequest for error</returns>

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);

            var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                var token = JwtUtils.JwtEncoder.GenerateJwtToken(user, user.UserType.ToString(), _context);
                return Ok(new { Token = token });
            }
            else
            {
                return BadRequest("Invalid email or password");
            }
        }


        #endregion

        #region Logout

        /// <summary>
        /// Action for logging out
        /// </summary>
        /// <param name="token">JWT of the user</param>
        /// <returns>200 if logged out or 404 if token is invalid</returns>
        [HttpPost("logout")]
        public IActionResult Logout(string token)
        {
            var jwt = _context.JsonWebTokens.FirstOrDefault(t => t.Token == token);

            if (jwt == null)
            {
                return NotFound("Token not found");
            }

            try
            {
                _context.JsonWebTokens.Remove(jwt);
                _context.SaveChanges();
                return Ok("Token deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        #endregion

        #region Decode JWT
        
        /// <summary>
        /// Decode the token back to readable JSON
        /// </summary>
        /// <param name="token">Token as string</param>
        /// <returns>The decoded token result as JSON</returns>
        [HttpGet("decode_token")]
        public string GetTokenAsJson(string token)
        {
            return JwtUtils.JwtDecoder.GetTokenAsJson(token);
        }
        #endregion
    }
}
