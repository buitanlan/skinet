import { Component, input, inject } from '@angular/core';
import { ProductFormValues } from '../../shared/models/product';
import { Brand } from '../../shared/models/brand';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../shared/services/admin.service';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, NgClass } from '@angular/common';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { Type } from '../../shared/models/type';

@Component({
  selector: 'app-edit-product-form',

  template: `
    <form class="mt-4" #productForm="ngForm" (ngSubmit)="onSubmit(productForm.valid && productForm.value)">
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="name">Product Name</label>
          <input
            [ngClass]="{ 'is-invalid': name.invalid && (name.dirty || name.touched) }"
            required
            type="text"
            class="form-control"
            id="name"
            placeholder="Product Name"
            name="name"
            #name="ngModel"
            [(ngModel)]="product().name"
          />
          @if (name.invalid && (name.dirty || name.touched)) {
            <div class="invalid-feedback">
              @if (name.errors?.['required']) {
                <div>Product Name is required</div>
              }
            </div>
          }
        </div>
        <div class="form-group col-md-6">
          <label for="price">Price</label>
          <input
            [ngClass]="{ 'is-invalid': price.invalid && (price.dirty || price.touched) }"
            required
            type="text"
            class="form-control"
            id="price"
            placeholder="Price"
            currencyMask
            name="price"
            #price="ngModel"
            pattern="^\\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(\\.[0-9][0-9])?$"
            [ngModel]="+product().price | number: '1.2-2'"
            (ngModelChange)="updatePrice(+$event)"
          />
          @if (price.invalid && (price.dirty || price.touched)) {
            <div class="invalid-feedback">
              @if (price.errors?.['required']) {
                <div>Product price is required</div>
              }
              @if (price.errors?.['pattern']) {
                <div>Product price needs to be decimal value</div>
              }
              @if (price.errors?.['min']) {
                <div>Product price must be greater than zero</div>
              }
            </div>
          }
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-12">
          <label for="description">Description</label>
          <textarea
            [ngClass]="{ 'is-invalid': description.invalid && (description.dirty || description.touched) }"
            required
            #description="ngModel"
            class="form-control"
            id="description"
            [(ngModel)]="product().description"
            name="description"
            rows="3"
          ></textarea>
          @if (description.invalid && (description.dirty || description.touched)) {
            <div class="invalid-feedback">
              @if (description.errors?.['required']) {
                <div>Product price is required</div>
              }
            </div>
          }
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="brand">Brand</label>
          <select id="brand" class="form-control" name="productBrandId" [(ngModel)]="product().productBrandId" required>
            @for (brand of brands(); track brand) {
              <option [selected]="product().productBrandId === brand.id" [ngValue]="brand.id">
                {{ brand.name }}
              </option>
            }
          </select>
        </div>
        <div class="form-group col-md-6">
          <label for="type">Type</label>
          <select id="type" class="form-control" name="productTypeId" [(ngModel)]="product().productTypeId" required>
            @for (type of types(); track type) {
              <option [selected]="product().productTypeId === type.id" [ngValue]="type.id">
                {{ type.name }}
              </option>
            }
          </select>
        </div>
      </div>
      <button [disabled]="!productForm.valid" type="submit" class="btn btn-primary my-3 float-right">Submit</button>
    </form>
  `,
  imports: [FormsModule, NgClass, CurrencyMaskModule, DecimalPipe],
  standalone: true
})
export class EditProductFormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly adminService = inject(AdminService);
  private readonly router = inject(Router);
  product = input(new ProductFormValues());
  brands = input<Brand[]>([]);
  types = input<Type[]>([]);
  min = 1;

  onSubmit(product: ProductFormValues) {
    if (this.route.snapshot.url[0].path === 'edit') {
      const updatedProduct = { ...this.product(), ...product, price: +product.price };
      this.adminService.updateProduct(updatedProduct, Number(this.route.snapshot.paramMap.get('id'))).subscribe(() => {
        void this.router.navigate(['/admin']);
      });
    } else {
      const newProduct = { ...product, price: +product.price };
      this.adminService.createProduct(newProduct).subscribe(() => {
        void this.router.navigate(['/admin']);
      });
    }
  }

  updatePrice(event: any) {
    this.product().price = event;
  }
}
