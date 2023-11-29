using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using TaskDo.Data;
using TaskDo.Data.Entities;

namespace TaskDo.Utils
{
    /// <summary>
    /// Utility class for JSON Web Tokens
    /// </summary>
    public static class JwtUtils
    {
        /// <summary>
        /// Decoder for JSON Web Tokens
        /// </summary>

        public static class JwtDecoder
        {
            /// <summary>
            /// Decode the token back to readable JSON
            /// </summary>
            /// <param name="token">JWT to decode</param>
            /// <returns>Decoded data as JSON</returns>
            public static string GetTokenAsJson(string token)
            {
                var claims = ValidateToken(token);

                var tokenDataAsSimplifiedJson = System.Text.Json.JsonSerializer.Serialize(claims);

                return tokenDataAsSimplifiedJson;
            }
            

            /// <summary>
            /// Decode the token to Dictionary
            /// </summary>
            /// <param name="token">JWT to decode</param>
            /// <returns>Dictionary</returns>
            public static Dictionary<string, string> GetTokenAsDictionary(string token)
            {
                return ValidateToken(token);
            }

            /// <summary>
            /// Get User by JSON Web Token
            /// </summary>
            /// <param name="token">User's token</param>
            /// <param name="context">DbContext for accessing db</param>
            /// <returns></returns>
            /// <exception cref="ArgumentException"></exception>
            public static User? GetUserByToken(string token, ApplicationDbContext context)
            {
                var dictionary = JsonConvert.DeserializeObject<Dictionary<string, string>>(GetTokenAsJson(token));
                if (dictionary == null)
                {
                    return null;
                }
                var user = context.Users.FirstOrDefault(x=>x.Id == dictionary["id"]);
                return user;
            }

            /// <summary>
            /// Get Expiration Date from Token
            /// </summary>
            /// <param name="token">JSON Web Token</param>
            /// <returns>DateTime</returns>
            /// <exception cref="ArgumentException">Invalid token</exception>
            public static DateTime GetExpirationDateFromToken(string token)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

                if (securityToken == null || securityToken.ValidTo == null)
                {
                    throw new ArgumentException("Invalid token or missing expiration date.");
                }

                return securityToken.ValidTo;
            }
        }

        /// <summary>
        /// Encoder for JSON Web Tokens  
        /// </summary>
        public static class JwtEncoder
        {
            /// <summary>
            /// Generates JSON Web Token using User ID and Role
            /// </summary>
            /// <param name="user">Given user</param>
            /// <param name="role">Given user's role</param>
            /// <param name="_context">DbContext for saving the created token to database</param>
            /// <returns>Generated token as string</returns>
            public static string GenerateJwtToken(User user, string role, ApplicationDbContext _context)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes("ASDFGHJKLQWERTYUIOPZXCVBNM1234567890");
                var expiryDate = DateTime.UtcNow.AddMinutes(1);

                var claims = new List<Claim>
                {
                    new Claim("id", user.Id.ToString()),
                    new Claim("role", role)
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
        }

        /// <summary>
        /// Retrieves JSON Web Token
        /// </summary>
        public static class JwtRetriever
        {
            /// <summary>
            /// Get JWT from request header
            /// </summary>
            /// <param name="headers">Headers as dictionary</param>
            /// <returns>Token or null</returns>
            public static string? GetTokenFromHeader(IHeaderDictionary headers)
            {
                var authHeader = headers["Authorization"].FirstOrDefault();

                if (authHeader == null || !authHeader.StartsWith("Bearer "))
                {
                    return null;
                }

                return authHeader.Substring("Bearer ".Length).Trim();
            }
        }

        #region Validation
        public static Dictionary<string,string> ValidateToken(string token)
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
                .ToDictionary(c => GetKeyFromClaimType(c.Type), c => c.Value);
            return claims;
        }
        private static string GetKeyFromClaimType(string claimType)
        {
            int lastIndex = claimType.LastIndexOf('/');
            return lastIndex >= 0 ? claimType.Substring(lastIndex + 1) : claimType;
        }
        #endregion
    }
}
