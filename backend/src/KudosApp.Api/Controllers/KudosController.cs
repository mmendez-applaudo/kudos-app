using System.Security.Claims;
using KudosApp.Application.Kudos.Commands;
using KudosApp.Application.Kudos.DTOs;
using KudosApp.Application.Kudos.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KudosApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KudosController : ControllerBase
{
    private readonly IMediator _mediator;

    public KudosController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<KudosDto>> Create([FromBody] CreateKudosDto dto, CancellationToken cancellationToken)
    {
        var senderIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? throw new UnauthorizedAccessException();
        var senderId = Guid.Parse(senderIdStr);

        var result = await _mediator.Send(
            new CreateKudosCommand(dto.Message, dto.Points, dto.RecipientId, dto.CategoryId, senderId),
            cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet]
    public async Task<ActionResult<List<KudosDto>>> GetList([FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetKudosListQuery(page, pageSize), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<KudosDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetKudosByIdQuery(id), cancellationToken);
        if (result is null) return NotFound();
        return Ok(result);
    }

    [HttpGet("leaderboard")]
    public async Task<ActionResult<List<LeaderboardEntryDto>>> GetLeaderboard(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetLeaderboardQuery(), cancellationToken);
        return Ok(result);
    }
}
