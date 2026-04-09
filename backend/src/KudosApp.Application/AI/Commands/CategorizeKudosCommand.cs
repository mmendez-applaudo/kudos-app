using MediatR;

namespace KudosApp.Application.AI.Commands;

public record CategorizeKudosCommand(string Message) : IRequest<string>;
