using KudosApp.Application.Kudos.DTOs;
using MediatR;

namespace KudosApp.Application.Kudos.Commands;

public record CreateKudosCommand(string Message, int Points, Guid RecipientId, Guid CategoryId, Guid SenderId) : IRequest<KudosDto>;
