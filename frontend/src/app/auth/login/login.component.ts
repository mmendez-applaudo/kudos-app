import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, CardModule, MessageModule, RouterLink],
  template: `
    <div class="flex justify-content-center align-items-center" style="min-height:80vh">
      <p-card header="Sign In to Kudos App" styleClass="w-full" style="max-width:420px;width:100%">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="field">
            <label for="email">Email</label>
            <input id="email" type="email" pInputText formControlName="email" class="w-full" placeholder="you@example.com" />
          </div>
          <div class="field mt-3">
            <label for="password">Password</label>
            <p-password id="password" formControlName="password" [feedback]="false" styleClass="w-full" inputStyleClass="w-full" placeholder="Password" [toggleMask]="true"></p-password>
          </div>
          @if (error) {
            <p-message severity="error" [text]="error" styleClass="w-full mt-2"></p-message>
          }
          <p-button type="submit" label="Sign In" styleClass="w-full mt-3" [loading]="loading" [disabled]="form.invalid"></p-button>
          <p class="text-center mt-3">No account? <a routerLink="/register">Register</a></p>
        </form>
      </p-card>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  loading = false;
  error = '';

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () => this.router.navigate(['/kudos']),
      error: () => { this.error = 'Invalid credentials'; this.loading = false; }
    });
  }
}
