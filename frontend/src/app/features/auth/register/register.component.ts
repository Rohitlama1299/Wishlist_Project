import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Start building your travel wishlist</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="name-row">
              <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" placeholder="First name">
                @if (registerForm.get('firstName')?.hasError('required') && registerForm.get('firstName')?.touched) {
                  <mat-error>Required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" placeholder="Last name">
                @if (registerForm.get('lastName')?.hasError('required') && registerForm.get('lastName')?.touched) {
                  <mat-error>Required</mat-error>
                }
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="Enter your email">
              <mat-icon matSuffix>email</mat-icon>
              @if (registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched) {
                <mat-error>Email is required</mat-error>
              }
              @if (registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched) {
                <mat-error>Please enter a valid email</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password" placeholder="Create a password">
              <button mat-icon-button matSuffix (click)="togglePasswordVisibility()" type="button">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched) {
                <mat-error>Password is required</mat-error>
              }
              @if (registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched) {
                <mat-error>Password must be at least 8 characters</mat-error>
              }
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="full-width submit-btn" [disabled]="loading()">
              @if (loading()) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Create Account
              }
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <p class="auth-link">
            Already have an account? <a routerLink="/auth/login">Sign in</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .auth-card {
      max-width: 450px;
      width: 100%;
      padding: 20px;
    }

    mat-card-header {
      margin-bottom: 20px;
      text-align: center;
      display: block;
    }

    mat-card-title {
      font-size: 24px !important;
      margin-bottom: 8px;
    }

    .name-row {
      display: flex;
      gap: 16px;
    }

    .name-row mat-form-field {
      flex: 1;
    }

    .full-width {
      width: 100%;
    }

    .submit-btn {
      margin-top: 16px;
      height: 48px;
    }

    mat-card-actions {
      text-align: center;
      padding-top: 16px;
    }

    .auth-link {
      margin: 0;
      color: #666;
    }

    .auth-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .auth-link a:hover {
      text-decoration: underline;
    }

    /* Mobile */
    @media (max-width: 480px) {
      .auth-container {
        padding: 16px;
      }

      .auth-card {
        padding: 16px;
      }

      mat-card-title {
        font-size: 20px !important;
      }

      mat-card-subtitle {
        font-size: 14px;
      }

      .name-row {
        flex-direction: column;
        gap: 0;
      }

      .submit-btn {
        height: 44px;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = signal(false);
  hidePassword = signal(true);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.snackBar.open('Account created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading.set(false);
        this.snackBar.open(error.error?.message || 'Registration failed', 'Close', { duration: 3000 });
      }
    });
  }
}
