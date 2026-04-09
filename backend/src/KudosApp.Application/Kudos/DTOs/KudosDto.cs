namespace KudosApp.Application.Kudos.DTOs;

public class KudosDto
{
    public Guid Id { get; set; }
    public string Message { get; set; } = string.Empty;
    public int Points { get; set; }
    public Guid SenderId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public Guid RecipientId { get; set; }
    public string RecipientName { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsFeatured { get; set; }
}
