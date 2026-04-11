export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  fullName: string;
}

export interface LeaderboardEntry {
  userId: string;
  fullName: string;
  points: number;
}
