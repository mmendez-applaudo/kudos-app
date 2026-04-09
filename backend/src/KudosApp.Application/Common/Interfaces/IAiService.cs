namespace KudosApp.Application.Common.Interfaces;

public interface IAiService
{
    IAsyncEnumerable<string> SuggestKudosMessageAsync(string recipientName, string? context, CancellationToken cancellationToken = default);
    Task<string> CategorizeKudosAsync(string message, IEnumerable<string> categoryNames, CancellationToken cancellationToken = default);
}
