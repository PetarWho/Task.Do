using Microsoft.AspNetCore.Mvc;

namespace TaskDo.Utils
{
    public class CustomStatusCodeResult : ObjectResult
    {
        public CustomStatusCodeResult(int statusCode, string message)
            : base(null)
        {
            StatusCode = statusCode;
            Value = new { error = message };
        }
    }
}
