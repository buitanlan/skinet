export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  productType: string;
  productBrand: string;
  photos: IPhoto[];
}

export interface IPhoto {
  id: number;
  pictureUrl: string;
  fileName: string;
  isMain: boolean;
}
export interface IProductToCreate {
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  productTypeId: number;
  productBrandId: number;
}

export class ProductFormValues implements IProductToCreate {
  name = '';
  description = '';
  price = 0;
  pictureUrl = '';
  productBrandId = 0;
  productTypeId = 0;

  constructor(init?: ProductFormValues) {
    Object.assign(this, init);
  }
}
