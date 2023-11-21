using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;
using System.Text;

namespace TaskDo.Utils
{
    public static class JwtDecoder
    {
        public static string GetTokenAsJson(string token)
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

            var tokenDataAsSimplifiedJson = JsonSerializer.Serialize(claims);

            return tokenDataAsSimplifiedJson;
        }
        private static string GetKeyFromClaimType(string claimType)
        {
            int lastIndex = claimType.LastIndexOf('/');
            return lastIndex >= 0 ? claimType.Substring(lastIndex + 1) : claimType;
        }
    }
}
