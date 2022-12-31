import { Component, ElementRef, Input, OnInit, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-text-input',
  template: `
    <div class="form-label-group">
      <input
        [ngClass]="
					controlDir && controlDir.control && controlDir.control.touched
						? !controlDir.control.valid
							? 'is-invalid'
							: 'is-valid'
						: 'null'
				"
        [type]="type"
        (input)="onChange($any($event.target).value)"
        (blur)="onTouched()"
        id="{{ label }}"
        #input
        class="form-control"
        placeholder="{{ label }}"
      />

      <div *ngIf="controlDir && controlDir.control && controlDir.control.status === 'PENDING'">
        <i class="fas fa-spinner fa-spin loader"></i>
      </div>
      <label for="{{ label }}">{{ label }}</label>
      <div
        class="invalid-feedback"
        *ngIf="controlDir && controlDir.control && !controlDir.control.valid && controlDir.control.touched"
      >
        <span *ngIf="controlDir.control.errors?.['required']">{{ label }} is required</span>
        <span *ngIf="controlDir.control.errors?.['pattern']">Invalid email pattern</span>
        <span *ngIf="controlDir.control.errors?.['emailExists']">Email address is in use</span>
      </div>
      <div
        class="invalid-feedback d-block"
        *ngIf="controlDir && controlDir.control && !controlDir.control.valid && controlDir.control.dirty"
      >
        <span *ngIf="controlDir.control.errors?.['emailExists']">Email address is in use</span>
      </div>
    </div>
  `,
  styleUrls: ['./text-input.component.scss'],
  imports: [NgClass, NgIf],
  standalone: true
})
export class TextInputComponent implements OnInit, ControlValueAccessor {
	@ViewChild('input', { static: true }) input!: ElementRef;
	@Input() type = 'text';
	@Input() label!: string;

	constructor(@Self() public controlDir: NgControl) {
		this.controlDir.valueAccessor = this;
	}

	ngOnInit(): void {
		const control = this.controlDir.control;
		const validators = control?.validator ?? [];
		const asyncValidators = control?.asyncValidator ?? [];

		control?.setValidators(validators);
		control?.setAsyncValidators(asyncValidators);
		control?.updateValueAndValidity();
	}

	onChange(event: Event) {}

	onTouched() {}

	writeValue(obj: any): void {
		this.input.nativeElement.value = obj || '';
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}
}
