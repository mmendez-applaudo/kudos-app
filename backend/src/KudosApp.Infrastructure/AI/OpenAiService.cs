using System.Net.Http.Headers;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using KudosApp.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;

namespace KudosApp.Infrastructure.AI;

public class OpenAiService : IAiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private const string ChatCompletionsUrl = "https://api.openai.com/v1/chat/completions";

    public OpenAiService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["OpenAI:ApiKey"] ?? string.Empty;
    }

    public async IAsyncEnumerable<string> SuggestKudosMessageAsync(
        string recipientName,
        string? context,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var userMessage = string.IsNullOrWhiteSpace(context)
            ? $"Write a kudos message for {recipientName}."
            : $"Write a kudos message for {recipientName}. Context: {context}";

        var requestBody = new
        {
            model = "gpt-4o",
            stream = true,
            messages = new[]
            {
                new { role = "system", content = "You are a helpful assistant that writes short, warm kudos messages for peer recognition. Be specific, positive and professional. Keep it under 150 words." },
                new { role = "user", content = userMessage }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, ChatCompletionsUrl);
        httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        httpRequest.Content = new StringContent(json, Encoding.UTF8, "application/json");

        using var response = await _httpClient.SendAsync(httpRequest, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var reader = new StreamReader(stream);

        while (!reader.EndOfStream && !cancellationToken.IsCancellationRequested)
        {
            var line = await reader.ReadLineAsync(cancellationToken);
            if (string.IsNullOrEmpty(line)) continue;
            if (!line.StartsWith("data: ")) continue;

            var data = line["data: ".Length..];
            if (data == "[DONE]") break;

            string? chunk = null;
            try
            {
                using var doc = JsonDocument.Parse(data);
                chunk = doc.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("delta")
                    .GetProperty("content")
                    .GetString();
            }
            catch
            {
                // skip malformed chunks
            }

            if (chunk != null)
                yield return chunk;
        }
    }

    public async Task<string> CategorizeKudosAsync(string message, IEnumerable<string> categoryNames, CancellationToken cancellationToken = default)
    {
        var categories = string.Join(", ", categoryNames);
        var userMessage = $"Kudos message: \"{message}\"\nCategories: {categories}";

        var requestBody = new
        {
            model = "gpt-4o",
            stream = false,
            messages = new[]
            {
                new { role = "system", content = "Given this kudos message and these categories, return ONLY the category name that best matches. Return nothing else." },
                new { role = "user", content = userMessage }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, ChatCompletionsUrl);
        httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        httpRequest.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(httpRequest, cancellationToken);
        response.EnsureSuccessStatusCode();

        var responseJson = await response.Content.ReadAsStringAsync(cancellationToken);
        using var doc = JsonDocument.Parse(responseJson);
        return doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? string.Empty;
    }
}
