using MediatR;

namespace KudosApp.Application.AI.Commands;

public record SuggestKudosMessageCommand(string RecipientName, string? Context) : IRequest<IAsyncEnumerable<string>>;
