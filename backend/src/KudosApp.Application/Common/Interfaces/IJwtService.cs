using KudosApp.Domain.Entities;

namespace KudosApp.Application.Common.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}
