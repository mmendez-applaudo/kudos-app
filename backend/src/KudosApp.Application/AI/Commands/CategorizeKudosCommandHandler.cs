using KudosApp.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KudosApp.Application.AI.Commands;

public class CategorizeKudosCommandHandler : IRequestHandler<CategorizeKudosCommand, string>
{
    private readonly IAiService _aiService;
    private readonly IAppDbContext _context;

    public CategorizeKudosCommandHandler(IAiService aiService, IAppDbContext context)
    {
        _aiService = aiService;
        _context = context;
    }

    public async Task<string> Handle(CategorizeKudosCommand request, CancellationToken cancellationToken)
    {
        var categoryNames = await _context.Categories
            .Select(c => c.Name)
            .ToListAsync(cancellationToken);

        return await _aiService.CategorizeKudosAsync(request.Message, categoryNames, cancellationToken);
    }
}
