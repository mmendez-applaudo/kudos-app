using KudosApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace KudosApp.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<User> Users { get; }
    DbSet<KudosApp.Domain.Entities.Kudos> Kudos { get; }
    DbSet<Category> Categories { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
