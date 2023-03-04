import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../shared/services/account.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-login',
  template: `
    <div class="d-flex justify-content-center mt-5">
      <div class="col-3">
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="text-center mb-4">
            <h1 class="h3 mb-3 font-weight-normal">Login</h1>
          </div>

          <app-text-input formControlName="email" [label]="'Email Address'"></app-text-input>
          <app-text-input formControlName="password" [label]="'Password'" [type]="'password'"></app-text-input>

          <button [disabled]="loginForm.invalid" class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        </form>
      </div>
    </div>
  `,
  imports: [ReactiveFormsModule, TextInputComponent],
  standalone: true
})
export class LoginComponent implements OnInit {
	loginForm!: FormGroup;
	returnUrl!: string;

	constructor(
		private readonly accountService: AccountService,
		private readonly router: Router,
		private readonly activatedRoute: ActivatedRoute,
	) {}

	ngOnInit() {
		this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/shop';
		this.createLoginForm();
	}

	createLoginForm() {
		this.loginForm = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', Validators.required),
		});
	}

	onSubmit() {
		this.accountService.login(this.loginForm.value).subscribe({
			next: () => void this.router.navigateByUrl(this.returnUrl),
			error: (error) => console.log(error),
		});
	}
}
