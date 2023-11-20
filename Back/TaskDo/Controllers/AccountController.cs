using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TaskDo.Data.Entities.Enums;
using TaskDo.Data.Entities;
using TaskDo.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using TaskDo.Data;
using System.Text.Json;

namespace TaskDo.Controllers
{

    /// <summary>
    /// Controller for managing user accounts
    /// </summary>

    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ApplicationDbContext _context;
        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
        }

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
                var token = GenerateJwtToken(user, UserTypeEnum.Employee.ToString());
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
                var token = GenerateJwtToken(user, UserTypeEnum.Manager.ToString());
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
        /// <param name="model">RegisterModel</param>
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
                var token = GenerateJwtToken(user, user.UserType.ToString());
                return Ok(new { Token = token });
            }
            else
            {
                return BadRequest("Invalid email or password");
            }
        }


        #endregion

        #region JWT
        private string GenerateJwtToken(User user, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("ASDFGHJKLQWERTYUIOPZXCVBNM1234567890");
            var expiryDate = DateTime.UtcNow.AddHours(24);

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.Id.ToString()),
        new Claim(ClaimTypes.Role, role)
    };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expiryDate,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenStr = tokenHandler.WriteToken(token);
            _context.JsonWebTokens.Add(new JsonWebToken()
            {
                Token = tokenStr,
                UserId = user.Id,
                ExpiryDate = expiryDate
            });
            _context.SaveChanges();
            return tokenStr;
        }

        #endregion

        #region Logout

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

        [HttpGet("decode_token")]
        public string GetTokenAsJson(string token)
        {
            string secret = "ASDFGHJKLQWERTYUIOPZXCVBNM1234567890";
            var key = Encoding.ASCII.GetBytes(secret);
            var handler = new JwtSecurityTokenHandler();
            var validations = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false
            };

            var claimsPrincipal = handler.ValidateToken(token, validations, out var tokenSecure);

            var claims = claimsPrincipal.Claims
                .Where(c => !string.IsNullOrEmpty(c.Type) && !string.IsNullOrEmpty(c.Value))
                .ToDictionary(c => c.Type, c => c.Value);

            var tokenDataAsSimplifiedJson = JsonSerializer.Serialize(claims);

            return tokenDataAsSimplifiedJson;
        }

    }
}
