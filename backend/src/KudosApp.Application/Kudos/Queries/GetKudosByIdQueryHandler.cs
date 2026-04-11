using KudosApp.Application.Common.Interfaces;
using KudosApp.Application.Kudos.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KudosApp.Application.Kudos.Queries;

public class GetKudosByIdQueryHandler : IRequestHandler<GetKudosByIdQuery, KudosDto?>
{
    private readonly IAppDbContext _context;

    public GetKudosByIdQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<KudosDto?> Handle(GetKudosByIdQuery request, CancellationToken cancellationToken)
    {
        return await _context.Kudos
            .Include(k => k.Sender)
            .Include(k => k.Recipient)
            .Include(k => k.Category)
            .Where(k => k.Id == request.Id)
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
            .FirstOrDefaultAsync(cancellationToken);
    }
}
