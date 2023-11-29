using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using TaskDo.Data;

namespace TaskDo.Utils.Attributes
{
    public class AuthorizeJwtAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            try
            {
                var token = JwtUtils.JwtRetriever.GetTokenFromHeader(context.HttpContext.Request.Headers);

                if (token == null)
                {
                    context.Result = new StatusCodeResult(StatusCodes.Status401Unauthorized);
                    return;
                }

                var claims = JwtUtils.ValidateToken(token);

                if (TokenExpired(token))
                {
                    context.Result = new CustomStatusCodeResult(498, "Invalid or Expired Token");
                    return;
                }

                var userId = claims.GetValueOrDefault("id");
                if (string.IsNullOrEmpty(userId))
                {
                    context.Result = new StatusCodeResult(StatusCodes.Status401Unauthorized);
                    return;
                }

                var dbContext = context.HttpContext.RequestServices.GetRequiredService<ApplicationDbContext>();
                var user = JwtUtils.JwtDecoder.GetUserByToken(token, dbContext);
                if (user == null)
                {
                    context.Result = new StatusCodeResult(StatusCodes.Status401Unauthorized);
                    return;
                }

                if (user == null)
                {
                    context.Result = new StatusCodeResult(StatusCodes.Status401Unauthorized);
                    return;
                }
            }
            catch (Exception)
            {
                context.Result = new StatusCodeResult(StatusCodes.Status401Unauthorized);
                return;
            }
        }

        private bool TokenExpired(string token)
        {
            var expirationDate = JwtUtils.JwtDecoder.GetExpirationDateFromToken(token);
            return expirationDate < DateTime.UtcNow;
        }
    }
}
