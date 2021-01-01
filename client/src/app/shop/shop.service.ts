import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IType } from '../shared/models/type';
import { map } from 'rxjs/operators';
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';
  constructor(private http: HttpClient) {}
  getBrand() {
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands');
  }
  getType() {
    return this.http.get<IType[]>(this.baseUrl + 'products/types');
  }
  getProduct(id: number) {
    return this.http.get<IProduct>(this.baseUrl + 'products/' + id);
  }
  getProducts(shopParams: ShopParams) {
    console.log('faf', shopParams);
    let params = new HttpParams();
    if (shopParams.brandName) {
      params = params.append('brandName', shopParams.brandName);
    }
    if (shopParams.typeName) {
      params = params.append('typeName', shopParams.typeName);
    }
    if (shopParams.search) {
      params = params.append('search', shopParams.search);
    }
    params = params.append('sort', shopParams.sort);
    params = params.append('pageIndex', shopParams.pageNumber.toString());
    params = params.append('pageSize', shopParams.pageSize.toString());
    return this.http
      .get<IPagination>(this.baseUrl + 'products', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }
}
