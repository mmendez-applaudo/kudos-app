using KudosApp.Application.Auth.DTOs;
using KudosApp.Application.Common.Interfaces;
using KudosApp.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KudosApp.Application.Auth.Commands;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponseDto>
{
    private readonly IAppDbContext _context;
    private readonly IPasswordService _passwordService;
    private readonly IJwtService _jwtService;

    public RegisterCommandHandler(IAppDbContext context, IPasswordService passwordService, IJwtService jwtService)
    {
        _context = context;
        _passwordService = passwordService;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var exists = await _context.Users
            .AnyAsync(u => u.Email == request.Email.ToLower(), cancellationToken);
        if (exists)
            throw new InvalidOperationException("Email already registered.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email.ToLower(),
            PasswordHash = _passwordService.HashPassword(request.Password),
            FullName = request.FullName,
            Department = request.Department,
            Points = 0,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        var token = _jwtService.GenerateToken(user);
        return new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            FullName = user.FullName,
            UserId = user.Id
        };
    }
}
