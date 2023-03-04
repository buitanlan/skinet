import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Brand } from '../shared/models/brand';
import { Pagination } from '../shared/models/pagination';
import { Product } from '../shared/models/product';
import { ShopParams } from '../shared/models/shopParams';
import { Type } from '../shared/models/type';
import { ShopService } from '../shared/services/shop.service';
import { NgForOf, NgIf } from '@angular/common';
import { PagingHeaderComponent } from '../shared/components/paging-header/paging-header.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { PagerComponent } from '../shared/components/pager/pager.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  template: `
    <div class="container mt-3">
      <div class="row" *ngIf="types.length > 0 && brands.length > 0">
        <section class="col-3">
          <h5 class="text-warning ms-3">Sort</h5>
          <select class="custom-select mb-4" (change)="onSortSelected($event)">
            <option *ngFor="let sort of sortOptions"
                    [selected]="shopParams.sort === sort.value"
                    [value]="sort.value">
              {{ sort.name }}
            </option>
          </select>
          <h5 class="text-warning ms-3">Brands</h5>
          <ul class="list-group my-3">
            <li
              class="list-group-item"
              *ngFor="let brand of brands"
              [class.active]="brand.name.toLowerCase() === this.shopParams.brandName"
              [value]="brand.id"
              (click)="onBrandSelected(brand.name.toLowerCase())"
            >
              {{ brand.name }}
            </li>
          </ul>
          <h5 class="text-warning ms-3">Types</h5>
          <ul class="list-group my-3">
            <li
              class="list-group-item"
              *ngFor="let type of types"
              [class.active]="type.name.toLowerCase() === this.shopParams.typeName"
              [value]="type.id"
              (click)="onTypeSelected(type.name.toLowerCase())"
            >
              {{ type.name }}
            </li>
          </ul>
        </section>
        <section class="col-9">
          <div class="d-flex justify-content-between align-items-center pb-2">
            <app-paging-header
              [totalCount]="this.totalCount"
              [pageSize]="this.shopParams.pageSize"
              [pageNumber]="this.shopParams.pageNumber"
            ></app-paging-header>

            <div class="d-flex mt-2">
              <input
                (keyup.enter)="onSearch()"
                class="form-control me-2"
                #search
                placeholder="Search"
                type="text"
              />
              <button (click)="onSearch()" class="btn btn-outline-primary mx-2">Search</button>
              <button (click)="onReset()" class="btn btn-outline-success">Reset</button>
            </div>
          </div>

          <div class="row row-cols-3 g-3 mb-4">
            <div class="col-4" *ngFor="let item of products">
              <app-product-item [product]="item"></app-product-item>
            </div>
          </div>
          <div class="d-flex justify-content-center" *ngIf="totalCount > 0">
            <app-pager
              [pageIndex]="this.shopParams.pageNumber"
              [pageSize]="shopParams.pageSize"
              [totalCount]="totalCount"
              (pageChanged)="onPageChanged($event)"
            ></app-pager>
          </div>
        </section>
      </div>
    </div>
  `,
  styleUrls: ['./shop.component.scss'],
  imports: [NgForOf, PagingHeaderComponent, ProductItemComponent, PagerComponent, FormsModule, NgIf],
  standalone: true
})
export class ShopComponent implements OnInit {
	@ViewChild('search', { static: false }) searchTerm!: ElementRef;
	products: Product[] = [];
	brands: Brand[] = [];
	types: Type[] = [];
	shopParams = new ShopParams();
	totalCount = 0;
	sortOptions = [
		{ name: 'Alphabetical', value: 'name' },
		{ name: 'Price: Low to High', value: 'asc' },
		{ name: 'Price: High to Low', value: 'desc' },
	];

	constructor(
		private readonly shopService: ShopService,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
	) {
		this.shopParams = this.shopService.getShopParams();
	}

	ngOnInit(): void {
		this.getBrands();
		this.getTypes();
		this.route.params.subscribe((params) => {
			this.shopParams.pageNumber = params['page'] || 1;
		});
		this.route.queryParams.subscribe((params) => {
			this.shopParams.sort = params['sort'] || 'name';
			this.shopParams.search = params['search'] || '';
			this.shopParams.brandName = params['brand'] || 'all';
			this.shopParams.typeName = params['type'] || 'all';
		});
		this.getProducts(true);
	}

	getProducts(useCache = false) {
		this.shopService.getProducts(useCache).subscribe({
			next: (response: Pagination) => {
				this.products = response.data;
				this.totalCount = response.count;
			},
			error: (error) => console.log(error),
		});
	}

	getBrands() {
		this.shopService.getBrand().subscribe({
			next: (response: Brand[]) => (this.brands = [{ id: 0, name: 'All' }, ...response]),
			error: (error) => console.log(error),
		});
	}

	getTypes() {
		this.shopService.getType().subscribe({
			next: (response: Type[]) => (this.types = [{ id: 0, name: 'All' }, ...response]),
			error: (error) => console.log(error),
		});
	}

	onBrandSelected(brandName: string) {
		const params = this.shopService.getShopParams();
		params.brandName = brandName;
		params.pageNumber = 1;
		this.shopService.setShopParams(params);
		this.getProducts();
		void this.router.navigate(['/shop/page', this.shopParams.pageNumber], {
			queryParams: {
				brand: this.shopParams.brandName,
			},
			queryParamsHandling: 'merge',
		});
	}

	onTypeSelected(typeName: string) {
		const params = this.shopService.getShopParams();
		params.typeName = typeName;
		params.pageNumber = 1;
		this.shopService.setShopParams(params);
		this.getProducts();
		void this.router.navigate(['/shop/page', this.shopParams.pageNumber], {
			queryParams: {
				type: this.shopParams.typeName,
			},
			queryParamsHandling: 'merge',
		});
	}

	onSortSelected(event: Event) {
		const sort = (event.target as HTMLSelectElement).value;
		const params = this.shopService.getShopParams();
		params.sort = sort;
		params.pageNumber = 1;
		this.shopService.setShopParams(params);
		this.getProducts();
		void this.router.navigate(['/shop/page', this.shopParams.pageNumber], {
			queryParams: {
				sort: this.shopParams.sort,
			},
			queryParamsHandling: 'merge',
		});
	}

	onPageChanged(event: number) {
		const params = this.shopService.getShopParams();

		if (params.pageNumber !== event) {
			params.pageNumber = event;
			this.shopService.setShopParams(params);
			this.getProducts(true);
			void this.router.navigate(['/shop/page', this.shopParams.pageNumber], {
				queryParamsHandling: 'merge',
			});
		}
	}

	onSearch() {
		const params = this.shopService.getShopParams();
		params.search = this.searchTerm.nativeElement.value;
		params.pageNumber = 1;
		this.shopService.setShopParams(params);
		this.getProducts();
		void this.router.navigate(['/shop/page', this.shopParams.pageNumber], {
			queryParams: {
				search: this.shopParams.search.toLowerCase(),
			},
			queryParamsHandling: 'merge',
		});
	}

	onReset() {
		this.searchTerm.nativeElement.value = '';
		const params = new ShopParams();
		this.shopService.setShopParams(params);
		void this.router.navigate(['/shop'], {
			queryParams: { page: this.shopParams.pageNumber },
		});
		this.getProducts();
	}
}
