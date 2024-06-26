import { Component, OnInit, input } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-stepper',
  template: `
    <div class="container">
      <ul class="nav nav-pills nav-justified">
        @for (step of steps; track step; let i = $index) {
          <li class="nav-item">
            <button
              (click)="onClick(i)"
              [class.active]="selectedIndex === i"
              class="nav-link py-3 text-uppercase font-weight-bold btn-block"
              style="padding: 1.2em"
            >
              {{ step.label }}
            </button>
          </li>
        }
      </ul>
      <div>
        <ng-container [ngTemplateOutlet]="selected?.content ?? null"></ng-container>
      </div>
    </div>
  `,
  styleUrls: ['./stepper.component.scss'],
  standalone: true,
  imports: [NgTemplateOutlet],

  providers: [{ provide: CdkStepper, useExisting: StepperComponent }]
})
export class StepperComponent extends CdkStepper implements OnInit {
  linearModeSelected = input(false);

  ngOnInit(): void {
    this.linear = this.linearModeSelected();
  }

  onClick(index: number) {
    this.selectedIndex = index;
  }
}
