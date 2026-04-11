using KudosApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace KudosApp.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (!await context.Categories.AnyAsync())
        {
            var categories = new List<Category>
            {
                new() { Id = Guid.NewGuid(), Name = "Teamwork", Description = "Recognition for outstanding collaboration and team support." },
                new() { Id = Guid.NewGuid(), Name = "Innovation", Description = "Recognition for creative ideas and innovative solutions." },
                new() { Id = Guid.NewGuid(), Name = "Leadership", Description = "Recognition for inspiring and guiding others." },
                new() { Id = Guid.NewGuid(), Name = "Customer Focus", Description = "Recognition for exceptional customer service and dedication." },
                new() { Id = Guid.NewGuid(), Name = "Excellence", Description = "Recognition for delivering high-quality work and exceeding expectations." }
            };
            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync();
        }

        if (!await context.Users.AnyAsync())
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("Demo123!");
            var users = new List<User>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    Email = "alice@demo.com",
                    PasswordHash = passwordHash,
                    FullName = "Alice Johnson",
                    Department = "Engineering",
                    Points = 0,
                    CreatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Email = "bob@demo.com",
                    PasswordHash = passwordHash,
                    FullName = "Bob Smith",
                    Department = "Product",
                    Points = 0,
                    CreatedAt = DateTime.UtcNow
                }
            };
            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();
        }
    }
}
