using KudosApp.Application.Kudos.DTOs;
using MediatR;

namespace KudosApp.Application.Kudos.Queries;

public record GetKudosByIdQuery(Guid Id) : IRequest<KudosDto?>;
