using KudosApp.Application.Auth.DTOs;
using MediatR;

namespace KudosApp.Application.Auth.Commands;

public record LoginCommand(string Email, string Password) : IRequest<AuthResponseDto>;
