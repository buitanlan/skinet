import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-home',
  template: `
    <carousel>
      <slide>
        <img src="assets/images/hero1.jpg" alt="first slide" style="display: block; width: 100%" />
      </slide>
      <slide>
        <img src="assets/images/hero2.jpg" alt="first slide" style="display: block; width: 100%" />
      </slide>
      <slide>
        <img src="assets/images/hero3.jpg" alt="first slide" style="display: block; width: 100%" />
      </slide>
    </carousel>
    <section class="featured">
      <div class="d-flex justify-content-center pt-4">
        <h1>Welcome to the Shop!</h1>
      </div>
    </section>
  `,
  styleUrls: ['./home.component.scss'],
  imports: [CarouselModule],
  standalone: true
})
export class HomeComponent {
  constructor() {}
}
