export class ShopParams implements IShopParams{
  brandName = 'all';
  typeName = 'all';
  sort = 'name';
  pageNumber = 1;
  pageSize = 6;
  search =  '';
}

export interface IShopParams {
  brandName: string;
  typeName: string;
  sort: string;
  pageNumber: number;
  pageSize: number;
  search: string;
}
