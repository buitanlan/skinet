import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
export class RegisterComponent implements OnInit {
	registerForm!: FormGroup;
	errors!: string;

	constructor(
		private readonly fb: UntypedFormBuilder,
		private accountService: AccountService,
		private readonly router: Router,
	) {}

	ngOnInit(): void {
		this.createRegisterForm();
	}

	createRegisterForm() {
		this.registerForm = this.fb.group({
			displayName: [null, [Validators.required]],
			email: [
				null,
				[Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')],
				[this.validateEmailNotToken()],
			],
			password: [null, [Validators.required]],
		});
	}

	onSubmit() {
		this.accountService.register(this.registerForm.value).subscribe({
			next: () => void this.router.navigateByUrl('/shop'),
			error: (error) => {
				this.errors = error.errors;
			},
		});
	}

	validateEmailNotToken(): AsyncValidatorFn {
		return (control) => {
			return timer(500).pipe(
				switchMap(() => {
					if (!control.value) {
						return of(null);
					}
					return this.accountService.checkEmailExists(control.value).pipe(
						map((res) => {
							return res ? { emailExists: true } : null;
						}),
					);
				}),
			);
		};
	}
}
