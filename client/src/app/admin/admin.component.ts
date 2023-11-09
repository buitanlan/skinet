import { Component, OnInit } from '@angular/core';
import { Product } from '../shared/models/product';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from '../shared/services/shop.service';
import { AdminService } from '../shared/services/admin.service';
import { PagingHeaderComponent } from '../shared/components/paging-header/paging-header.component';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { PagerComponent } from '../shared/components/pager/pager.component';

@Component({
  selector: 'app-admin',
  template: `
    @if (products) {
    <section class="admin-page">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="d-flex justify-content-between my-3">
              <header class="h2">Product List</header>
              <button [routerLink]="['/admin/create']" class="btn btn-outline-success">Create new product</button>
            </div>

            <app-paging-header
              [totalCount]="totalCount"
              [pageSize]="this.shopParams.pageSize"
              [pageNumber]="this.shopParams.pageNumber"
            ></app-paging-header>

            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">
                      <div class="p-2">Id</div>
                    </th>
                    <th scope="col">
                      <div class="p-2 text-uppercase">Product</div>
                    </th>
                    <th scope="col">
                      <div class="py-2 text-uppercase">Name</div>
                    </th>
                    <th scope="col">
                      <div class="p-2 px-3 text-uppercase">Price</div>
                    </th>
                    <th scope="col">
                      <div class="p-2 px-3 text-uppercase">Edit</div>
                    </th>
                    <th scope="col">
                      <div class="p-2 px-3 text-uppercase">Delete</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  @for (product of products; track product) {
                  <tr>
                    <td class="align-middle">{{ product.id }}</td>
                    <td>
                      <div class="p-2">
                        <img
                          src="{{ product.pictureUrl || '/assets/images/placeholder.png' }}"
                          alt="{{ product.name }}"
                          class="img-fluid"
                          style="max-height: 50px"
                        />
                      </div>
                    </td>
                    <th class="align-middle">
                      <h5>{{ product.name }}</h5>
                    </th>
                    <td class="align-middle">{{ product.price | currency }}</td>
                    <td class="align-middle">
                      <button [routerLink]="['edit', product.id]" class="btn btn-warning">Edit</button>
                    </td>
                    <td class="align-middle">
                      <button (click)="deleteProduct(product.id)" class="btn btn-danger">Delete</button>
                    </td>
                  </tr>
                  }
                </tbody>
              </table>
            </div>
            @if (totalCount > 0) {
            <div class="d-flex justify-content-center">
              <app-pager
                [pageSize]="shopParams.pageSize"
                [pageIndex]="shopParams.pageNumber"
                [totalCount]="totalCount"
                (pageChanged)="onPageChanged($event)"
              ></app-pager>
            </div>
            }
          </div>
        </div>
      </div>
    </section>
    }
  `,
  imports: [PagingHeaderComponent, RouterLink, NgIf, CurrencyPipe, NgForOf, PagerComponent],
  standalone: true
})
export class AdminComponent implements OnInit {
  products: Product[] = {} as Product[];
  totalCount = 0;
  shopParams: ShopParams;

  constructor(
    private readonly shopService: ShopService,
    private readonly adminService: AdminService
  ) {
    this.shopParams = this.shopService.getShopParams();
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(useCache = false) {
    this.shopService.getProducts(useCache).subscribe({
      next: (response) => {
        this.products = response.data;
        this.totalCount = response.count;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  onPageChanged(event: any) {
    const params = this.shopService.getShopParams();
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.shopService.setShopParams(params);
      this.getProducts(true);
    }
  }

  deleteProduct(id: number) {
    this.adminService.deleteProduct(id).subscribe(() => {
      this.products.splice(
        this.products.findIndex((p) => p.id === id),
        1
      );
      this.totalCount--;
    });
  }
}
