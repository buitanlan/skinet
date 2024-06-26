import { Component, inject } from '@angular/core';
import { AsyncValidatorFn, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, take } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { AccountService } from '../../shared/services/account.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-register',
  template: `
    <div class="d-flex justify-content-center mt-5">
      <div class="col-3">
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="text-center mb-4">
            <h1 class="h3 mb-3 font-weight-normal">Register</h1>
          </div>
          <app-text-input formControlName="displayName" [label]="'Display Name'"></app-text-input>
          <app-text-input formControlName="email" [label]="'Email Address'"></app-text-input>
          <app-text-input formControlName="password" [label]="'Password'" [type]="'password'"></app-text-input>
          @if (errors) {
            <ul class="text-danger list-unstyled">
              @for (error of errors; track error) {
                <li>{{ error }}</li>
              }
            </ul>
          }
          <button [disabled]="registerForm.invalid" class="btn btn-lg btn-primary btn-block" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  `,
  imports: [TextInputComponent, ReactiveFormsModule],
  standalone: true
})
export class RegisterComponent {
  private readonly fb = inject(UntypedFormBuilder);
  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  errors!: string[];
  complexPassword =
    "(?=^.{6,10}$)(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*s).*$";
  registerForm = this.fb.group({
    displayName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email], [this.validateEmailNotToken()]],
    password: ['', [Validators.required, Validators.pattern(this.complexPassword)]]
  });

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => void this.router.navigateByUrl('/shop'),
      error: (error) => (this.errors = error.errors)
    });
  }

  validateEmailNotToken(): AsyncValidatorFn {
    return (control) => {
      return control.valueChanges.pipe(
        debounceTime(1000),
        take(1),
        switchMap(() => {
          return this.accountService.checkEmailExists(control.value).pipe(
            map((res) => {
              return res ? { emailExists: true } : null;
            }),
            finalize(() => control.markAsTouched())
          );
        })
      );
    };
  }
}
