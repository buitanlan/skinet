import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Brand } from '../models/brand';
import { Pagination } from '../models/pagination';
import { Type } from '../models/type';
import { map } from 'rxjs/operators';
import { ShopParams } from '../models/shopParams';
import { Product } from '../models/product';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ShopService {
	baseUrl = environment.apiUrl;
	products: Product[] = [];
	brands: Brand[] = [];
	types: Type[] = [];
	pagination = new Pagination();
	shopParams = new ShopParams();
	productCache = new Map();

	constructor(private readonly http: HttpClient) {}

	getBrand() {
		if (this.brands.length > 0) {
			return of(this.brands);
		}
		return this.http.get<Brand[]>(this.baseUrl + 'products/brands').pipe(
			map((response) => {
				this.brands = response;
				return response;
			}),
		);
	}

	getType() {
		if (this.types.length > 0) {
			return of(this.types);
		}
		return this.http.get<Type[]>(this.baseUrl + 'products/types').pipe(
			map((response) => {
				this.types = response;
				return response;
			}),
		);
	}

	getProduct(id: number) {
		let product: Product | undefined;
		this.productCache.forEach((products: Product[]) => {
			product = products.find((p) => p.id === id);
		});

		if (product) {
			return of(product);
		} else {
			return this.http.get<Product>(this.baseUrl + 'products/' + id);
		}
	}

	getProducts(useCache: boolean) {
		if (!useCache) {
			this.productCache = new Map();
		}

		if (this.productCache.size > 0 && useCache) {
			if (this.productCache.has(Object.values(this.shopParams).join('-'))) {
				this.pagination.data = this.productCache.get(Object.values(this.shopParams).join('-'));
				return of(this.pagination);
			}
		}

		let params = new HttpParams();
		if (this.shopParams.brandName) {
			params = params.append('brandName', this.shopParams.brandName);
		}
		if (this.shopParams.typeName) {
			params = params.append('typeName', this.shopParams.typeName);
		}
		if (this.shopParams.search) {
			params = params.append('search', this.shopParams.search);
		}
		params = params.append('sort', this.shopParams.sort);
		params = params.append('pageIndex', this.shopParams.pageNumber.toString());
		params = params.append('pageSize', this.shopParams.pageSize.toString());
		return this.http
			.get<Pagination>(this.baseUrl + 'products', {
				observe: 'response',
				params,
			})
			.pipe(
				map((response) => {
					this.productCache.set(Object.values(this.shopParams).join('-'), response.body?.data);
					this.pagination = response.body ?? ({} as Pagination);
					return this.pagination;
				}),
			);
	}

	setShopParams(params: ShopParams): void {
		this.shopParams = params;
	}

	getShopParams() {
		return this.shopParams;
	}
}
