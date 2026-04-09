using KudosApp.Application.Common.Interfaces;
using MediatR;

namespace KudosApp.Application.AI.Commands;

public class SuggestKudosMessageCommandHandler : IRequestHandler<SuggestKudosMessageCommand, IAsyncEnumerable<string>>
{
    private readonly IAiService _aiService;

    public SuggestKudosMessageCommandHandler(IAiService aiService)
    {
        _aiService = aiService;
    }

    public Task<IAsyncEnumerable<string>> Handle(SuggestKudosMessageCommand request, CancellationToken cancellationToken)
    {
        return Task.FromResult(_aiService.SuggestKudosMessageAsync(request.RecipientName, request.Context, cancellationToken));
    }
}
