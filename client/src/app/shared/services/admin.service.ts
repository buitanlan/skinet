import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product, ProductFormValues } from '../models/product';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  createProduct(product: ProductFormValues) {
    return this.http.post(this.baseUrl + 'products', product);
  }

  updateProduct(product: ProductFormValues, id: number) {
    return this.http.put(this.baseUrl + 'products/' + id, product);
  }

  deleteProduct(id: number) {
    return this.http.delete(this.baseUrl + 'products/' + id);
  }

  uploadImage(file: File, id: number) {
    const formData = new FormData();
    formData.append('photo', file, 'image.png');
    return this.http.put(this.baseUrl + 'products/' + id + '/photo', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteProductPhoto(photoId: number, productId: number) {
    return this.http.delete(this.baseUrl + 'products/' + productId + '/photo/' + photoId);
  }

  setMainPhoto(photoId: number, productId: number) {
    return this.http.post<Product>(this.baseUrl + 'products/' + productId + '/photo/' + photoId, {});
  }
}
