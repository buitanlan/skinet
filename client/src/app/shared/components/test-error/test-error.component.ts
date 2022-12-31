import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-test-error',
  template: `
    <div class="container mt-5">
      <button (click)="get500Error()" class="btn btn-outline-primary ms-3">Test 500 Error</button>
      <button (click)="get404Error()" class="btn btn-outline-primary ms-3">Test 404 Error</button>
      <button (click)="get400Error()" class="btn btn-outline-primary ms-3">Test 400 Error</button>
      <button (click)="get400ValidationError()" class="btn btn-outline-primary ms-3">Test 500 Validation</button>
      <div class="div row mt-5" *ngIf="validationErrors">
        <ul class="text-danger">
          <li *ngFor="let error of validationErrors">{{ error }}</li>
        </ul>
      </div>
    </div>
  `,
  imports: [NgIf, NgForOf],
  standalone: true
})
export class TestErrorComponent {
	baseUrl = environment.apiUrl;
	validationErrors: any;

	constructor(private readonly http: HttpClient) {}

	get404Error() {
		this.http.get(this.baseUrl + 'products/42').subscribe({
			next: (response) => console.log(response),
			error: (error) => console.log(error),
		});
	}

	get500Error() {
		this.http.get(this.baseUrl + 'buggy/servererror').subscribe({
			next: (response) => console.log(response),
			error: (error) => console.log(error),
		});
	}

	get400Error() {
		this.http.get(this.baseUrl + 'buggy/badrequest').subscribe({
			next: (response) => console.log(response),
			error: (error) => console.log(error),
		});
	}

	get400ValidationError() {
		this.http.get(this.baseUrl + 'products/fortytwo').subscribe({
			next: (response) => console.log(response),
			error: (error) => {
				console.log(error);
				this.validationErrors = error.errors;
			},
		});
	}
}
