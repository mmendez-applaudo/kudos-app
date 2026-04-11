using KudosApp.Application.Kudos.DTOs;
using MediatR;

namespace KudosApp.Application.Kudos.Queries;

public record GetLeaderboardQuery : IRequest<List<LeaderboardEntryDto>>;
