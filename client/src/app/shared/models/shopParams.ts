export class ShopParams implements ShopParams {
	brandName = 'all';
	typeName = 'all';
	sort = 'name';
	pageNumber = 1;
	pageSize = 6;
	search = '';
}

export interface ShopParams {
	brandName: string;
	typeName: string;
	sort: string;
	pageNumber: number;
	pageSize: number;
	search: string;
}
