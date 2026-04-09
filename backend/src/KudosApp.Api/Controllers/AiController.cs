using KudosApp.Application.AI.Commands;
using KudosApp.Application.AI.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KudosApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AiController : ControllerBase
{
    private readonly IMediator _mediator;

    public AiController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("suggest")]
    public async Task Suggest([FromBody] AiSuggestionRequestDto dto, CancellationToken cancellationToken)
    {
        Response.ContentType = "text/event-stream";
        Response.Headers.CacheControl = "no-cache";

        var stream = await _mediator.Send(new SuggestKudosMessageCommand(dto.RecipientName, dto.Context), cancellationToken);

        await foreach (var chunk in stream.WithCancellation(cancellationToken))
        {
            await Response.WriteAsync($"data: {chunk}\n\n", cancellationToken);
            await Response.Body.FlushAsync(cancellationToken);
        }
    }

    [HttpPost("categorize")]
    public async Task<ActionResult<AiSuggestionDto>> Categorize([FromBody] AiCategorizeRequestDto dto, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new CategorizeKudosCommand(dto.Message), cancellationToken);
        return Ok(new AiSuggestionDto { Suggestion = result });
    }
}
