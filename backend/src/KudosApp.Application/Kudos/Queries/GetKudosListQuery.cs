using KudosApp.Application.Kudos.DTOs;
using MediatR;

namespace KudosApp.Application.Kudos.Queries;

public record GetKudosListQuery(int Page, int PageSize) : IRequest<List<KudosDto>>;
