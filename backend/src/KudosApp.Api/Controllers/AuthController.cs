using KudosApp.Application.Auth.Commands;
using KudosApp.Application.Auth.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KudosApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new LoginCommand(dto.Email, dto.Password), cancellationToken);
        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new RegisterCommand(dto.Email, dto.Password, dto.FullName, dto.Department), cancellationToken);
        return Ok(result);
    }
}
