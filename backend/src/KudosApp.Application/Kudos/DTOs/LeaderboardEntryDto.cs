namespace KudosApp.Application.Kudos.DTOs;

public class LeaderboardEntryDto
{
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public int Points { get; set; }
    public int Rank { get; set; }
}
