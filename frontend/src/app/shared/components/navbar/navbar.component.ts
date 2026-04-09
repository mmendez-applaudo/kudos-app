import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonModule, MenubarModule],
  template: `
    <div class="navbar">
      <div class="navbar-brand">
        <a routerLink="/kudos" class="brand-link">🏆 Kudos App</a>
      </div>
      <div class="navbar-menu">
        <a routerLink="/kudos" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Feed</a>
        <a routerLink="/kudos/create" routerLinkActive="active">Give Kudos</a>
        <a routerLink="/leaderboard" routerLinkActive="active">Leaderboard</a>
      </div>
      <div class="navbar-user" *ngIf="auth.currentUser() as user">
        <span class="user-name">{{ user.fullName }}</span>
        <p-button label="Logout" severity="secondary" size="small" (onClick)="auth.logout()"></p-button>
      </div>
    </div>
  `,
  styles: [`
    .navbar { display:flex; align-items:center; padding:.75rem 1.5rem; background:linear-gradient(135deg,#3b82f6,#8b5cf6); color:#fff; gap:1.5rem; }
    .brand-link { color:#fff; text-decoration:none; font-size:1.25rem; font-weight:700; }
    .navbar-menu { display:flex; gap:1.25rem; flex:1; }
    .navbar-menu a { color:rgba(255,255,255,.85); text-decoration:none; font-weight:500; padding:.25rem .5rem; border-radius:.25rem; }
    .navbar-menu a.active, .navbar-menu a:hover { color:#fff; background:rgba(255,255,255,.15); }
    .navbar-user { display:flex; align-items:center; gap:.75rem; }
    .user-name { font-size:.875rem; }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
}
