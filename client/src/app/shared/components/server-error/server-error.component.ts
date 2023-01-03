import { Component } from '@angular/core';

@Component({
  selector: 'app-server-error',
  template: `
    <div class="container mt-5">
      <h1>Internal Server Error</h1>
    </div>
  `,
  standalone: true
})
export class ServerErrorComponent {
  constructor() {}
}
