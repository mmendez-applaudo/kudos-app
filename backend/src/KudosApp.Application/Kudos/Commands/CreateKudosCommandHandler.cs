using KudosApp.Application.Common.Interfaces;
using KudosApp.Application.Kudos.DTOs;
using KudosApp.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KudosApp.Application.Kudos.Commands;

public class CreateKudosCommandHandler : IRequestHandler<CreateKudosCommand, KudosDto>
{
    private readonly IAppDbContext _context;

    public CreateKudosCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<KudosDto> Handle(CreateKudosCommand request, CancellationToken cancellationToken)
    {
        var recipient = await _context.Users.FindAsync(new object[] { request.RecipientId }, cancellationToken)
            ?? throw new KeyNotFoundException("Recipient not found.");

        var sender = await _context.Users.FindAsync(new object[] { request.SenderId }, cancellationToken)
            ?? throw new KeyNotFoundException("Sender not found.");

        var category = await _context.Categories.FindAsync(new object[] { request.CategoryId }, cancellationToken)
            ?? throw new KeyNotFoundException("Category not found.");

        var kudos = new KudosApp.Domain.Entities.Kudos
        {
            Id = Guid.NewGuid(),
            Message = request.Message,
            Points = request.Points,
            SenderId = request.SenderId,
            RecipientId = request.RecipientId,
            CategoryId = request.CategoryId,
            CreatedAt = DateTime.UtcNow,
            IsFeatured = false
        };

        recipient.Points += request.Points;

        _context.Kudos.Add(kudos);
        await _context.SaveChangesAsync(cancellationToken);

        return new KudosDto
        {
            Id = kudos.Id,
            Message = kudos.Message,
            Points = kudos.Points,
            SenderId = kudos.SenderId,
            SenderName = sender.FullName,
            RecipientId = kudos.RecipientId,
            RecipientName = recipient.FullName,
            CategoryId = kudos.CategoryId,
            CategoryName = category.Name,
            CreatedAt = kudos.CreatedAt,
            IsFeatured = kudos.IsFeatured
        };
    }
}
