﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskDo.Data;
using TaskDo.Utils.Attributes;
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
        public UsersController(ApplicationDbContext _context)
        {
            context = _context;
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
            var users = context.Users.Where(x=>x.UserType == Data.Entities.Enums.UserTypeEnum.Employee).ToList();

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
    }
}
