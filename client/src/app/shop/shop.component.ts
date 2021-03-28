import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { ShopParams } from '../shared/models/shopParams';
import { IType } from '../shared/models/type';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  @ViewChild('search', { static: false }) searchTerm: ElementRef;
  products: IProduct[];
  brands: IBrand[] = [];
  types: IType[] = [];
  shopParams = new ShopParams();
  totalCount: number;
  sortOptions = [
    { name: 'Alphabetical', value: 'name'},
    { name: 'Price: Low to High', value: 'asc'},
    { name: 'Price: High to Low', value: 'desc'},
  ];
  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.shopParams = this.shopService.getShopParams();
  }


  ngOnInit(): void {
    this.getBrands();
    this.getTypes();
    this.route.params
      .subscribe((params) => {
        this.shopParams.pageNumber = params.page || 1;
      });
    this.route.queryParams
      .subscribe((params) => {
        this.shopParams.sort = params.sort || 'name';
        this.shopParams.search = params.search || '';
        this.shopParams.brandName = params.brand || 'all';
        this.shopParams.typeName = params.type || 'all';

      });
    this.getProducts(true);
  }


  getProducts(useCache = false) {
    this.shopService.getProducts(useCache).pipe(
    ).subscribe(
      (response: IPagination) => {
        this.products = response.data;
        this.totalCount = response.count;
      },
      (error) => {
        console.log(error);
      }
    );
  }


  getBrands() {
    this.shopService.getBrand().subscribe(
      (response: IBrand[]) => {
        this.brands = [{ id: 0, name: 'All' }, ...response];
      },
      (error) => {
        console.log(error);
      }
    );
  }


  getTypes() {
    this.shopService.getType().subscribe(
      (response: IType[]) => {
        this.types = [{ id: 0, name: 'All' }, ...response];
      },
      (error) => {
        console.log(error);
      }
    );
  }


  onBrandSelected(brandName: string) {
    const params = this.shopService.getShopParams();
    params.brandName = brandName;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
    this.router.navigate(['/shop/page', this.shopParams.pageNumber], {
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
    this.router.navigate(['/shop/page', this.shopParams.pageNumber], {
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
    this.router.navigate(['/shop/page', this.shopParams.pageNumber], {
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
      this.router.navigate(['/shop/page', this.shopParams.pageNumber], {
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
    this.router.navigate(['/shop/page', this.shopParams.pageNumber], {
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
    this.router.navigate(['/shop'], {
      queryParams: { page: this.shopParams.pageNumber },
    });
    this.getProducts();
  }
}
