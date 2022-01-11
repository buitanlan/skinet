using Core.Entities.Identity;

namespace Core.Interfaces;

public interface ITokenService
{
    Task<string> CreateAccessToken(AppUser user);
    RefreshToken CreateRefreshToken(string ipAddress);

}
