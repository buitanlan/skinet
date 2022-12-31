import { Component, Input, OnInit } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';
import { NgForOf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-stepper',
  template: `
    <div class="container">
      <ul class="nav nav-pills nav-justified">
        <li class="nav-item" *ngFor="let step of steps; let i = index">
          <button
            (click)="onClick(i)"
            [class.active]="selectedIndex === i"
            class="nav-link py-3 text-uppercase font-weight-bold btn-block"
            style="padding: 1.2em"
          >
            {{ step.label }}
          </button>
        </li>
      </ul>
      <div>
        <ng-container [ngTemplateOutlet]="selected?.content ?? null"></ng-container>
      </div>
    </div>
  `,
  styleUrls: ['./stepper.component.scss'],
  standalone: true,
  imports: [NgTemplateOutlet, NgForOf],

  providers: [{ provide: CdkStepper, useExisting: StepperComponent }]
})
export class StepperComponent extends CdkStepper implements OnInit {
	@Input() linearModeSelected = false;

	ngOnInit(): void {
		this.linear = this.linearModeSelected;
	}

	onClick(index: number) {
		this.selectedIndex = index;
	}
}
