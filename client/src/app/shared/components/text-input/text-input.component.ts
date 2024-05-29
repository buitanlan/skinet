import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-text-input',
  template: `
    <div class="form-floating mb-3">
      <input
        type="{{ type }}"
        [formControl]="control"
        placeholder="{{ label }}"
        class="form-control"
        [ngClass]="control.touched ? (control.invalid ? 'is-invalid' : 'is-valid') : null"
      />
      @if (control.status === 'PENDING') {
        <div class="fa fa-spinner fa-spin loader"></div>
      }
      <label for="floatingInput">{{ label }}</label>
      @if (control.errors?.['required']) {
        <div class="invalid-feedback">Please enter your {{ label }}</div>
      }
      @if (control.errors?.['email']) {
        <div class="invalid-feedback">Invalid email address</div>
      }
      @if (control.errors?.['pattern']) {
        <div class="invalid-feedback">Password not complex enough</div>
      }
      @if (control.errors?.['emailExists']) {
        <div class="invalid-feedback">Email address is taken</div>
      }
    </div>
  `,
  styleUrls: ['./text-input.component.scss'],
  imports: [NgClass, NgIf, ReactiveFormsModule],
  standalone: true
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() type = 'text';
  @Input() label!: string;

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  writeValue(obj: any): void {}

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  get control(): FormControl {
    return this.controlDir.control as FormControl;
  }
}
