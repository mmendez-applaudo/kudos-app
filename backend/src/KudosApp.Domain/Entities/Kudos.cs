namespace KudosApp.Domain.Entities;

public class Kudos
{
    public Guid Id { get; set; }
    public string Message { get; set; } = string.Empty;
    public int Points { get; set; }
    public Guid SenderId { get; set; }
    public Guid RecipientId { get; set; }
    public Guid CategoryId { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsFeatured { get; set; }

    public User Sender { get; set; } = null!;
    public User Recipient { get; set; } = null!;
    public Category Category { get; set; } = null!;
}
