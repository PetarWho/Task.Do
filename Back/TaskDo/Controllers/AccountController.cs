using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TaskDo.Data.Entities.Enums;
using TaskDo.Data.Entities;
using TaskDo.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace TaskDo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        #region Register

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
                var token = GenerateJwtToken(user);
                return Ok(new { Token = token });
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

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
                var token = GenerateJwtToken(user);
                return Ok(new { Token = token });
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        #endregion

        #region Login

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
                var token = GenerateJwtToken(user);
                return Ok(new { Token = token });
            }
            else
            {
                return BadRequest("Invalid email or password");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("ASDFGHJKLQWERTYUIOPZXCVBNM1234567890");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, user.Id.ToString()),
        }),
                Expires = DateTime.UtcNow.AddHours(24), 
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        #endregion
    }
}
