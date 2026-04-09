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
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, CardModule, MessageModule, RouterLink],
  template: `
    <div class="flex justify-content-center align-items-center" style="min-height:80vh">
      <p-card header="Create Account" styleClass="w-full" style="max-width:440px;width:100%">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="field">
            <label>Full Name</label>
            <input type="text" pInputText formControlName="fullName" class="w-full" placeholder="Jane Doe" />
          </div>
          <div class="field mt-3">
            <label>Department</label>
            <input type="text" pInputText formControlName="department" class="w-full" placeholder="Engineering" />
          </div>
          <div class="field mt-3">
            <label>Email</label>
            <input type="email" pInputText formControlName="email" class="w-full" placeholder="you@example.com" />
          </div>
          <div class="field mt-3">
            <label>Password</label>
            <p-password formControlName="password" styleClass="w-full" inputStyleClass="w-full" [toggleMask]="true"></p-password>
          </div>
          @if (error) {
            <p-message severity="error" [text]="error" styleClass="w-full mt-2"></p-message>
          }
          @if (success) {
            <p-message severity="success" text="Account created! Redirecting..." styleClass="w-full mt-2"></p-message>
          }
          <p-button type="submit" label="Register" styleClass="w-full mt-3" [loading]="loading" [disabled]="form.invalid"></p-button>
          <p class="text-center mt-3">Already have an account? <a routerLink="/login">Sign in</a></p>
        </form>
      </p-card>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    fullName: ['', Validators.required],
    department: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  loading = false;
  error = '';
  success = false;

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { email, password, fullName, department } = this.form.value;
    this.auth.register(email!, password!, fullName!, department!).subscribe({
      next: () => { this.success = true; setTimeout(() => this.router.navigate(['/login']), 1500); },
      error: () => { this.error = 'Registration failed. Email may already exist.'; this.loading = false; }
    });
  }
}
