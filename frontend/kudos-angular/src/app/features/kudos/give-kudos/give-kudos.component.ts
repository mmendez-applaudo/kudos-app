import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

import { AuthService } from '../../../core/services/auth.service';

interface UserOption {
  id: string;
  name: string;
}

interface CategoryOption {
  id: string;
  name: string;
  points: number;
}

@Component({
  selector: 'app-give-kudos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    SelectModule,
    TextareaModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>

    <div class="give-kudos-page">
      <header class="page-header">
        <button pButton type="button" label="Back to Feed" icon="pi pi-arrow-left" [text]="true" routerLink="/feed"></button>
      </header>

      <main class="page-content">
        <p-card styleClass="give-kudos-card">
          <ng-template pTemplate="title">
            <div class="card-title-block">
              <p class="eyebrow">Recognition</p>
              <h1>Give kudos</h1>
            </div>
          </ng-template>

          <ng-template pTemplate="subtitle">
            Celebrate someone’s impact with a category and a thoughtful message.
          </ng-template>

          @if (isInitializing()) {
            <div class="status-panel" aria-live="polite">
              <p>Loading users and categories...</p>
            </div>
          } @else {
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="kudos-form" novalidate>
              <div class="field-grid">
                <div class="field-group">
                  <label for="recipientId">Recipient</label>
                  <p-select
                    inputId="recipientId"
                    formControlName="recipientId"
                    [options]="users()"
                    optionLabel="name"
                    optionValue="id"
                    [filter]="true"
                    filterBy="name"
                    placeholder="Select a teammate"
                    styleClass="w-full"
                  ></p-select>
                </div>

                <div class="field-group">
                  <label for="categoryId">Category</label>
                  <p-select
                    inputId="categoryId"
                    formControlName="categoryId"
                    [options]="categories()"
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Choose a category"
                    styleClass="w-full"
                  >
                    <ng-template let-category pTemplate="item">
                      <div class="category-option">
                        <span>{{ category.name }}</span>
                        <strong>{{ category.points }} pts</strong>
                      </div>
                    </ng-template>
                    <ng-template let-category pTemplate="selectedItem">
                      @if (category) {
                        <div class="category-option">
                          <span>{{ category.name }}</span>
                          <strong>{{ category.points }} pts</strong>
                        </div>
                      } @else {
                        <span>Choose a category</span>
                      }
                    </ng-template>
                  </p-select>
                </div>
              </div>

              <div class="field-group">
                <div class="message-toolbar">
                  <label for="message">Message</label>
                  <div class="toolbar-actions">
                    <button
                      pButton
                      type="button"
                      label="Suggest Message"
                      icon="pi pi-sparkles"
                      severity="secondary"
                      [outlined]="true"
                      [loading]="isSuggestingMessage()"
                      [disabled]="!canSuggestMessage()"
                      (click)="suggestMessage()"
                    ></button>
                    <button
                      pButton
                      type="button"
                      label="Auto-detect Category"
                      icon="pi pi-bolt"
                      severity="contrast"
                      [outlined]="true"
                      [loading]="isDetectingCategory()"
                      [disabled]="!canDetectCategory()"
                      (click)="autoDetectCategory()"
                    ></button>
                  </div>
                </div>
                <textarea
                  id="message"
                  pTextarea
                  formControlName="message"
                  rows="6"
                  class="w-full"
                  placeholder="Describe what the recipient did and why it mattered."
                ></textarea>
              </div>

              <div class="form-actions">
                <button pButton type="submit" label="Send Kudos" [loading]="isSubmitting()" [disabled]="isSubmitting()"></button>
              </div>
            </form>
          }
        </p-card>
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .give-kudos-page {
        min-height: 100dvh;
        padding: 1.5rem;
        background:
          radial-gradient(circle at top right, color-mix(in srgb, var(--p-primary-color) 14%, transparent) 0, transparent 28%),
          linear-gradient(180deg, #f7f9fc 0%, #eef5ff 100%);
      }

      .page-header,
      .page-content {
        width: min(960px, 100%);
        margin: 0 auto;
      }

      .page-header {
        margin-bottom: 1rem;
      }

      .card-title-block h1,
      .eyebrow {
        margin: 0;
      }

      .eyebrow {
        color: var(--p-primary-color);
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .kudos-form {
        display: grid;
        gap: 1.25rem;
      }

      .field-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .field-group {
        display: grid;
        gap: 0.5rem;
      }

      .message-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      .toolbar-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .category-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        width: 100%;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
      }

      .status-panel {
        padding: 2rem 0;
        text-align: center;
        color: #4b6279;
      }

      .w-full {
        width: 100%;
      }

      @media (max-width: 720px) {
        .field-grid {
          grid-template-columns: 1fr;
        }

        .message-toolbar,
        .form-actions {
          align-items: stretch;
          flex-direction: column;
        }
      }
    `
  ]
})
export class GiveKudosComponent {
  private readonly http = inject(HttpClient);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly apiUrl = 'https://localhost:7162/api';

  protected readonly users = signal<UserOption[]>([]);
  protected readonly categories = signal<CategoryOption[]>([]);
  protected readonly isInitializing = signal(true);
  protected readonly isSuggestingMessage = signal(false);
  protected readonly isDetectingCategory = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly selectedRecipient = computed(() => {
    const recipientId = this.form.controls.recipientId.value;
    return this.users().find((user) => user.id === recipientId) ?? null;
  });
  protected readonly selectedCategory = computed(() => {
    const categoryId = this.form.controls.categoryId.value;
    return this.categories().find((category) => category.id === categoryId) ?? null;
  });

  protected readonly form = this.formBuilder.nonNullable.group({
    recipientId: ['', [Validators.required]],
    categoryId: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.maxLength(1000)]]
  });

  ngOnInit(): void {
    this.loadReferenceData();
  }

  protected canSuggestMessage(): boolean {
    return !!this.form.controls.recipientId.value && !!this.form.controls.categoryId.value && !this.isSuggestingMessage();
  }

  protected canDetectCategory(): boolean {
    return this.form.controls.message.value.trim().length > 0 && !this.isDetectingCategory();
  }

  protected suggestMessage(): void {
    const recipient = this.selectedRecipient();
    const category = this.selectedCategory();
    if (!recipient || !category) {
      return;
    }

    this.isSuggestingMessage.set(true);
    this.http
      .post<unknown>(`${this.apiUrl}/ai/suggest-message`, {
        recipientName: recipient.name,
        categoryName: category.name
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isSuggestingMessage.set(false))
      )
      .subscribe({
        next: (response) => {
          const suggestion = this.extractString(response, ['suggestion', 'message', 'text']);
          if (!suggestion) {
            this.messageService.add({
              severity: 'warn',
              summary: 'No suggestion available',
              detail: 'The AI service did not return a suggested message.'
            });
            return;
          }

          this.form.controls.message.setValue(suggestion);
        },
        error: (error: unknown) => {
          this.showHttpError('Could not suggest a message', error);
        }
      });
  }

  protected autoDetectCategory(): void {
    const message = this.form.controls.message.value.trim();
    if (!message) {
      return;
    }

    this.isDetectingCategory.set(true);
    this.http
      .post<unknown>(`${this.apiUrl}/ai/suggest-category`, {
        message,
        availableCategories: this.categories().map((category) => category.name)
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isDetectingCategory.set(false))
      )
      .subscribe({
        next: (response) => {
          const suggestedCategoryName = this.extractString(response, ['categoryName', 'suggestedCategory', 'category']);
          if (!suggestedCategoryName) {
            this.messageService.add({
              severity: 'warn',
              summary: 'No category match',
              detail: 'The AI service did not return a matching category.'
            });
            return;
          }

          const matchingCategory = this.categories().find(
            (category) => category.name.toLowerCase() === suggestedCategoryName.toLowerCase()
          );
          if (!matchingCategory) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Category not found',
              detail: `No category named ${suggestedCategoryName} is available.`
            });
            return;
          }

          this.form.controls.categoryId.setValue(matchingCategory.id);
        },
        error: (error: unknown) => {
          this.showHttpError('Could not auto-detect a category', error);
        }
      });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const currentUser = this.authService.getUser();
    if (!currentUser?.userId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Session unavailable',
        detail: 'Your session is missing the sender ID. Please sign in again.'
      });
      void this.router.navigate(['/login']);
      return;
    }

    const { recipientId, categoryId, message } = this.form.getRawValue();

    this.isSubmitting.set(true);
    this.http
      .post(`${this.apiUrl}/kudos`, {
        senderId: currentUser.userId,
        recipientId,
        categoryId,
        message: message.trim()
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isSubmitting.set(false))
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Kudos sent',
            detail: 'Your recognition has been shared successfully.'
          });
          void this.router.navigate(['/feed']);
        },
        error: (error: unknown) => {
          this.showHttpError('Could not send kudos', error);
        }
      });
  }

  private loadReferenceData(): void {
    this.isInitializing.set(true);

    forkJoin({
      users: this.http.get<unknown>(`${this.apiUrl}/users`),
      categories: this.http.get<unknown>(`${this.apiUrl}/categories`)
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isInitializing.set(false))
      )
      .subscribe({
        next: ({ users, categories }) => {
          this.users.set(this.normalizeUsers(users));
          this.categories.set(this.normalizeCategories(categories));
        },
        error: (error: unknown) => {
          this.showHttpError('Could not load form data', error);
        }
      });
  }

  private normalizeUsers(response: unknown): UserOption[] {
    if (!Array.isArray(response)) {
      return [];
    }

    return response
      .map((item) => {
        if (!this.isRecord(item)) {
          return null;
        }

        const id = this.extractString(item, ['id', 'userId']);
        const name = this.extractString(item, ['name', 'fullName']);
        return id && name ? { id, name } : null;
      })
      .filter((item): item is UserOption => item !== null);
  }

  private normalizeCategories(response: unknown): CategoryOption[] {
    if (!Array.isArray(response)) {
      return [];
    }

    return response
      .map((item) => {
        if (!this.isRecord(item)) {
          return null;
        }

        const id = this.extractString(item, ['id', 'categoryId']);
        const name = this.extractString(item, ['name']);
        const points = this.extractNumber(item, ['points']) ?? 0;
        return id && name ? { id, name, points } : null;
      })
      .filter((item): item is CategoryOption => item !== null);
  }

  private showHttpError(summary: string, error: unknown): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail: this.resolveErrorMessage(error)
    });
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'string' && error.error.length > 0) {
        return error.error;
      }

      if (this.isRecord(error.error)) {
        const message = this.extractString(error.error, ['message', 'title', 'detail']);
        if (message) {
          return message;
        }
      }
    }

    return 'Please try again in a moment.';
  }

  private extractString(source: unknown, keys: string[]): string | null {
    if (!this.isRecord(source)) {
      return null;
    }

    for (const key of keys) {
      const value = source[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        return value;
      }
    }

    return null;
  }

  private extractNumber(source: unknown, keys: string[]): number | null {
    if (!this.isRecord(source)) {
      return null;
    }

    for (const key of keys) {
      const value = source[key];
      if (typeof value === 'number') {
        return value;
      }
    }

    return null;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
