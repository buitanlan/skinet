import { Product } from './product';

export interface Pagination {
	pageIndex: number;
	pageSize: number;
	count: number;
	data: Product[];
}

export class Pagination implements Pagination {
	pageIndex = 1;
	pageSize = 6;
	count = 0;
	data: Product[] = [];
}
