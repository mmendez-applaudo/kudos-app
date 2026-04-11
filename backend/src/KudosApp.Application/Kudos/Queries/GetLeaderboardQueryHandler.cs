using KudosApp.Application.Common.Interfaces;
using KudosApp.Application.Kudos.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KudosApp.Application.Kudos.Queries;

public class GetLeaderboardQueryHandler : IRequestHandler<GetLeaderboardQuery, List<LeaderboardEntryDto>>
{
    private readonly IAppDbContext _context;

    public GetLeaderboardQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<LeaderboardEntryDto>> Handle(GetLeaderboardQuery request, CancellationToken cancellationToken)
    {
        var users = await _context.Users
            .OrderByDescending(u => u.Points)
            .Take(10)
            .ToListAsync(cancellationToken);

        return users.Select((u, i) => new LeaderboardEntryDto
        {
            UserId = u.Id,
            FullName = u.FullName,
            Department = u.Department,
            Points = u.Points,
            Rank = i + 1
        }).ToList();
    }
}
