import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Brand } from 'src/app/shared/models/brand';
import { Product, ProductFormValues } from 'src/app/shared/models/product';
import { Type } from 'src/app/shared/models/type';
import { ShopService } from 'src/app/shared/services/shop.service';
import { AdminService } from '../../shared/services/admin.service';
import { EditProductFormComponent } from '../edit-product-form/edit-product-form.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { EditProductPhotosComponent } from '../edit-product-photos/edit-product-photos.component';

@Component({
  selector: 'app-edit-product',
  template: `
    <section class="product-edit mt-5">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="tab-panel">
              <tabset class="product-tabset">
                <tab heading="Edit Product">
                  <div class="col-lg-8">
                    <app-edit-product-form [product]="productFormValues" [brands]="brands" [types]="types">
                    </app-edit-product-form>
                  </div>
                </tab>
                <tab heading="Edit Photos">
                  <app-edit-product-photos [product]="product"></app-edit-product-photos>
                </tab>
              </tabset>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  imports: [EditProductFormComponent, TabsModule, EditProductPhotosComponent],
  standalone: true
})
export class EditProductComponent implements OnInit {
	product = {} as Product;

	productFormValues: ProductFormValues;
	brands = [] as Brand[];
	types = [] as Type[];

	constructor(
		private readonly adminService: AdminService,
		private readonly shopService: ShopService,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
	) {
		this.productFormValues = new ProductFormValues();
	}

	ngOnInit(): void {
		const brands = this.getBrands();
		const types = this.getTypes();

		forkJoin([types, brands]).subscribe({
			next: (results) => {
				this.types = results[0];
				this.brands = results[1];
			},
			error: (error) => console.log(error),
			complete: () => {
				if (this.route.snapshot.url[0].path === 'edit') {
					this.loadProduct();
				}
			},
		});
	}

	updatePrice(event: any) {
		this.product.price = event;
	}

	loadProduct() {
		this.shopService.getProduct(Number(this.route.snapshot.paramMap.get('id'))).subscribe((response: Product) => {
			const productBrandId = this.brands.find((x) => x.name === response.productBrand)?.id;
			const productTypeId = this.types.find((x) => x.name === response.productType)?.id;
			this.product = response;
			if (productBrandId && productTypeId) {
				this.productFormValues = { ...response, productBrandId, productTypeId };
			}
		});
	}

	getBrands() {
		return this.shopService.getBrand();
	}

	getTypes() {
		return this.shopService.getType();
	}

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
}
