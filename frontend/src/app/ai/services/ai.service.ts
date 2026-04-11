import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly apiUrl = 'http://localhost:5000/api/ai';

  constructor(private http: HttpClient) {}

  categorize(message: string): Observable<{ categoryName: string }> {
    return this.http.post<{ categoryName: string }>(`${this.apiUrl}/categorize`, { message });
  }

  suggestMessage(recipientName: string, context: string): Observable<string> {
    return new Observable<string>(observer => {
      fetch(`${this.apiUrl}/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') ?? ''}` },
        body: JSON.stringify({ recipientName, context })
      }).then(async response => {
        if (!response.ok || !response.body) { observer.error('AI request failed'); return; }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) { observer.complete(); break; }
          const chunk = decoder.decode(value, { stream: true });
          chunk.split('\n').forEach(line => {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data && data !== '[DONE]') observer.next(data);
            }
          });
        }
      }).catch(err => observer.error(err));
    });
  }
}
