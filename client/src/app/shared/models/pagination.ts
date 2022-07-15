import { IProduct } from './product';
export interface IPagination {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: IProduct[];
}

export class Pagination implements IPagination {
  pageIndex = 1;
  pageSize = 6;
  count = 0;
  data: IProduct[] = [];
}
