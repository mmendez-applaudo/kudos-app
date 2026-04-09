namespace KudosApp.Application.Kudos.DTOs;

public class CreateKudosDto
{
    public string Message { get; set; } = string.Empty;
    public int Points { get; set; }
    public Guid RecipientId { get; set; }
    public Guid CategoryId { get; set; }
}
