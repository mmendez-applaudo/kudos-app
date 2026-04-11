import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Kudos, KudosListResponse } from '../../shared/models/kudos.model';
import { LeaderboardEntry } from '../../shared/models/auth.model';

@Injectable({ providedIn: 'root' })
export class KudosService {
  private readonly apiUrl = 'http://localhost:5000/api/kudos';

  constructor(private http: HttpClient) {}

  getKudosList(page = 1, pageSize = 10): Observable<KudosListResponse> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<KudosListResponse>(this.apiUrl, { params });
  }

  getKudosById(id: string): Observable<Kudos> {
    return this.http.get<Kudos>(`${this.apiUrl}/${id}`);
  }

  createKudos(data: { message: string; recipientId: string; categoryId: string; points: number }): Observable<Kudos> {
    return this.http.post<Kudos>(this.apiUrl, data);
  }

  getLeaderboard(): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(`${this.apiUrl}/leaderboard`);
  }
}
