import { Injectable, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  private readonly spinnerService = inject(NgxSpinnerService);
  busyRequestCount = 0;

  busy() {
    this.busyRequestCount++;
    void this.spinnerService.show(undefined, {
      type: 'timer',
      bdColor: 'rgba(255, 255, 255, 0.7)',
      color: '#333333'
    });
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      void this.spinnerService.hide();
    }
  }
}
