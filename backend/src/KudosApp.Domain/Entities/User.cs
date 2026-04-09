namespace KudosApp.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public int Points { get; set; }
    public DateTime CreatedAt { get; set; }

    public ICollection<Kudos> SentKudos { get; set; } = new List<Kudos>();
    public ICollection<Kudos> ReceivedKudos { get; set; } = new List<Kudos>();
}
