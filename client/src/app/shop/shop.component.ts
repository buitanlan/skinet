import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { ShopParams } from '../shared/models/shopParams';
import { IType } from '../shared/models/type';
import { ShopService } from './shop.service';
import { filter } from 'rxjs/operators';

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
  ) { }

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
    this.getProducts();
  }
  // tslint:disable-next-line:typedef
  getProducts() {
    this.shopService.getProducts(this.shopParams).pipe(
    ).subscribe(
      (response: IPagination) => {
        this.products = response.data;

        this.shopParams.pageNumber = response.pageIndex;

        this.shopParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  // tslint:disable-next-line:typedef
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
  // tslint:disable-next-line:typedef
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
  // tslint:disable-next-line:typedef
  onBrandSelected(brandName: string) {
    this.shopParams.brandName = brandName;
    this.shopParams.pageNumber = 1;
    this.getProducts();
    this.router.navigate(['/shop/page', this.shopParams.pageNumber], {
      queryParams: {
        brand: this.shopParams.brandName,
      },
      queryParamsHandling: 'merge',
    });
  }
  onTypeSelected(typeName: string) {
    this.shopParams.typeName = typeName;
    this.shopParams.pageNumber = 1;
    this.getProducts();
    this.router.navigate(['/shop/page', this.shopParams.pageNumber], {
      queryParams: {
        type: this.shopParams.typeName,
      },
      queryParamsHandling: 'merge',
    });
  }
  onSortSelected(sort: string) {
    this.shopParams.sort = sort;
    this.shopParams.pageNumber = 1;
    this.getProducts();
    this.router.navigate(['/shop/page', this.shopParams.pageNumber], {
      queryParams: {
        sort: this.shopParams.sort,
      },
      queryParamsHandling: 'merge',
    });
  }
  onPageChanged(event: number) {
    if (this.shopParams.pageNumber !== event) {
      this.shopParams.pageNumber = event;
      this.getProducts();
      this.router.navigate(['/shop/page', this.shopParams.pageNumber], {
        queryParamsHandling: 'merge',
      });
    }
  }

  onSearch() {
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.shopParams.pageNumber = 1;
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
    this.shopParams = new ShopParams();
    this.router.navigate(['/shop'], {
      queryParams: { page: this.shopParams.pageNumber },
    });
    this.getProducts();
  }
}
