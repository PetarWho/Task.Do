using Microsoft.AspNetCore.Identity;
using TaskDo.Data.Entities.Enums;

namespace TaskDo.Data.Entities
{
    public abstract class User : IdentityUser
    {
        protected UserTypeEnum UserType { get; set; } = 0;
    }
}
