import { Component, Input } from '@angular/core';
import { ProductFormValues } from '../../shared/models/product';
import { IBrand } from '../../shared/models/brand';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../shared/services/admin.service';
import { IType } from 'src/app/shared/models/type';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { CurrencyMaskModule } from 'ng2-currency-mask';

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
            [(ngModel)]="product.name"
          />
          <div *ngIf="name.invalid && (name.dirty || name.touched)" class="invalid-feedback">
            <div *ngIf="name.errors?.['required']">Product Name is required</div>
          </div>
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
            [ngModel]="+product.price | number : '1.2-2'"
            (ngModelChange)="updatePrice(+$event)"
          />
          <div *ngIf="price.invalid && (price.dirty || price.touched)" class="invalid-feedback">
            <div *ngIf="price.errors?.['required']">Product price is required</div>
            <div *ngIf="price.errors?.['pattern']">Product price needs to be decimal value</div>
            <div *ngIf="price.errors?.['min']">Product price must be greater than zero</div>
          </div>
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
            [(ngModel)]="product.description"
            name="description"
            rows="3"
          ></textarea>
          <div *ngIf="description.invalid && (description.dirty || description.touched)" class="invalid-feedback">
            <div *ngIf="description.errors?.['required']">Product price is required</div>
          </div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="brand">Brand</label>
          <select id="brand" class="form-control" name="productBrandId" [(ngModel)]="product.productBrandId" required>
            <option *ngFor="let brand of brands" [selected]="product.productBrandId === brand.id" [ngValue]="brand.id">
              {{ brand.name }}
            </option>
          </select>
        </div>
        <div class="form-group col-md-6">
          <label for="type">Type</label>
          <select id="type" class="form-control" name="productTypeId" [(ngModel)]="product.productTypeId" required>
            <option *ngFor="let type of types" [selected]="product.productTypeId === type.id" [ngValue]="type.id">
              {{ type.name }}
            </option>
          </select>
        </div>
      </div>
      <button [disabled]="!productForm.valid" type="submit" class="btn btn-primary my-3 float-right">Submit</button>
    </form>
  `,
  imports: [FormsModule, NgClass, CurrencyMaskModule, DecimalPipe, NgIf, NgForOf],
  standalone: true
})
export class EditProductFormComponent {
	@Input() product = new ProductFormValues();
	@Input() brands: IBrand[] = [];
	@Input() types: IType[] = [];
	min = 1;

	constructor(
		private readonly route: ActivatedRoute,
		private readonly adminService: AdminService,
		private readonly router: Router,
	) {}

	onSubmit(product: ProductFormValues) {
		if (this.route.snapshot.url[0].path === 'edit') {
			const updatedProduct = { ...this.product, ...product, price: +product.price };
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
		this.product.price = event;
	}
}
