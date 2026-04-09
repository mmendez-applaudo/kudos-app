using KudosApp.Application.Common.Interfaces;
using KudosApp.Application.Kudos.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KudosApp.Application.Kudos.Queries;

public class GetKudosListQueryHandler : IRequestHandler<GetKudosListQuery, List<KudosDto>>
{
    private readonly IAppDbContext _context;

    public GetKudosListQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<KudosDto>> Handle(GetKudosListQuery request, CancellationToken cancellationToken)
    {
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize < 1 ? 10 : request.PageSize;

        return await _context.Kudos
            .Include(k => k.Sender)
            .Include(k => k.Recipient)
            .Include(k => k.Category)
            .OrderByDescending(k => k.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(k => new KudosDto
            {
                Id = k.Id,
                Message = k.Message,
                Points = k.Points,
                SenderId = k.SenderId,
                SenderName = k.Sender.FullName,
                RecipientId = k.RecipientId,
                RecipientName = k.Recipient.FullName,
                CategoryId = k.CategoryId,
                CategoryName = k.Category.Name,
                CreatedAt = k.CreatedAt,
                IsFeatured = k.IsFeatured
            })
            .ToListAsync(cancellationToken);
    }
}
