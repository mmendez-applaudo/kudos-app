namespace KudosApp.Application.AI.DTOs;

public class AiSuggestionRequestDto
{
    public string RecipientName { get; set; } = string.Empty;
    public string? Context { get; set; }
}
