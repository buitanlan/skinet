import {Component, Input, OnInit} from '@angular/core';
import { ProductFormValues } from '../../shared/models/product';
import { IBrand } from '../../shared/models/brand';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { IType } from 'src/app/shared/models/type';

@Component({
  selector: 'app-edit-product-form',
  templateUrl: './edit-product-form.component.html',
  styleUrls: ['./edit-product-form.component.scss']
})
export class EditProductFormComponent implements OnInit {
  @Input() product = new ProductFormValues();
  @Input() brands: IBrand[] = [];
  @Input() types: IType[] = [];
  min = 1;

  constructor(private route: ActivatedRoute, private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(product: ProductFormValues) {
    if (this.route.snapshot.url[0].path === 'edit') {
      const updatedProduct = {...this.product, ...product, price: +product.price};
      this.adminService.updateProduct(updatedProduct, Number(this.route.snapshot.paramMap.get('id')))
        .subscribe((response: any) => {
        this.router.navigate(['/admin']);
      });
    } else {
      const newProduct = {...product, price: +product.price};
      this.adminService.createProduct(newProduct).subscribe((response: any) => {
        this.router.navigate(['/admin']);
      });
    }
  }


  updatePrice(event: any) {
    this.product.price = event;
  }

}
