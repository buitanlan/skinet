import { Component, OnInit } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { ShopParams } from '../shared/models/shopParams';
import { IType } from '../shared/models/type';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: IProduct[];
  brands: IBrand[];
  types: IType[];
  shopParams = new ShopParams();
  totalCount: number;
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' }
  ];
  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }
  // tslint:disable-next-line:typedef
  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe((response: IPagination) => {
      this.products = response.data;
      this.shopParams.pageNumber = response.pageIndex;
      this.shopParams.pageSize = response.pageSize;
      this.totalCount = response.count;
    }, error => {
      console.log(error);
    });
  }
  // tslint:disable-next-line:typedef
  getBrands() {
    this.shopService.getBrand().subscribe((response: IBrand[]) => {
      this.brands = [{ id: 0, name: 'All' }, ... response];
    }, error => {
      console.log(error);
    });
  }
  // tslint:disable-next-line:typedef
  getTypes() {
    this.shopService.getType().subscribe((response: IType[]) => {
      this.types = [{ id: 0, name: 'All' }, ...response];
    }, error => {
      console.log(error);
    });
  }
  // tslint:disable-next-line:typedef
  onBrandSelected(brandId: number) {
    this.shopParams.brandId = brandId;
    this.getProducts();
  }
  onTypeSelected(typeId: number) {
    this.shopParams.typeId = typeId;
    this.getProducts();
  }
  onSortSelected(sort: string) {
    this.shopParams.sort = sort;
    this.getProducts();
  }
  onPageChanged(event: any) {
    this.shopParams.pageNumber = event.page;
    this.getProducts();

  }
}
