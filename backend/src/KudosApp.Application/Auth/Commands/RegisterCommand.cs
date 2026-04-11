using KudosApp.Application.Auth.DTOs;
using MediatR;

namespace KudosApp.Application.Auth.Commands;

public record RegisterCommand(string Email, string Password, string FullName, string Department) : IRequest<AuthResponseDto>;
