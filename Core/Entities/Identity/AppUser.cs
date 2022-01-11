using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity;

public class AppUser : IdentityUser
{
    public string? DisplayName { get; set; }
    public Address? Address { get; set; }
    
    [JsonIgnore]
    public List<RefreshToken> RefreshTokens { get; set; }

    
}
