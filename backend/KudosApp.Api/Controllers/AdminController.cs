using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using KudosApp.Application.Features.Admin.Queries;
using KudosApp.Application.Features.Admin.Commands;
using KudosApp.Application.Features.Users.DTOs;
using KudosApp.Application.Features.Admin.DTOs;

namespace KudosApp.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController(IMediator mediator) : ControllerBase
{
    [HttpGet("users")]
    public async Task<ActionResult<List<UserResponse>>> GetUsers()
    {
        var response = await mediator.Send(new GetAdminUsersQuery());
        return Ok(response);
    }

    [HttpPut("users/{id}/role")]
    public async Task<ActionResult<UserResponse>> ChangeUserRole(Guid id, [FromBody] ChangeUserRoleCommand command)
    {
        if (id != command.UserId)
            return BadRequest("UserId in URL and body do not match.");

        var response = await mediator.Send(command);
        return Ok(response);
    }

    [HttpGet("analytics")]
    public async Task<ActionResult<AnalyticsResponse>> GetAnalytics()
    {
        var response = await mediator.Send(new GetAnalyticsQuery());
        return Ok(response);
    }
}
