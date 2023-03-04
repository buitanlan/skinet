import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounce, debounceTime, of, take, timer } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { AccountService } from '../../shared/services/account.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { NgForOf, NgIf } from '@angular/common';

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
          <ul class="text-danger list-unstyled" *ngIf="errors">
            <li *ngFor="let error of errors">{{ error }}</li>
          </ul>
          <button [disabled]="registerForm.invalid" class="btn btn-lg btn-primary btn-block" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  `,
  imports: [TextInputComponent, ReactiveFormsModule, NgForOf, NgIf],
  standalone: true
})
export class RegisterComponent {
	errors!: string[];
	complexPassword =
		"(?=^.{6,10}$)(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*s).*$";

	constructor(
		private readonly fb: UntypedFormBuilder,
		private readonly accountService: AccountService,
		private readonly router: Router,
	) {}

	registerForm = this.fb.group({
		displayName: ['', [Validators.required]],
		email: ['', [Validators.required, Validators.email], [this.validateEmailNotToken()]],
		password: ['', [Validators.required, Validators.pattern(this.complexPassword)]],
	});

	onSubmit() {
		this.accountService.register(this.registerForm.value).subscribe({
			next: () => void this.router.navigateByUrl('/shop'),
			error: (error) => (this.errors = error.errors),
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
						finalize(() => control.markAsTouched()),
					);
				}),
			);
		};
	}
}
