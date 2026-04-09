import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../../shared/models/auth.model';
import { User } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:5000/api/auth';
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  currentUser = signal<User | null>(this.getStoredUser());
  isLoggedIn = computed(() => !!this.currentUser());

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        const user: User = { id: response.userId, email: response.email, fullName: response.fullName, department: '', points: 0 };
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

  register(email: string, password: string, fullName: string, department: string): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, fullName, department });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) as User : null;
  }
}
