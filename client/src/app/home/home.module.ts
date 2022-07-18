import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  declarations: [HomeComponent],
  imports: [HomeRoutingModule, CarouselModule.forRoot()],
  exports: [HomeComponent]
})
export class HomeModule {}
