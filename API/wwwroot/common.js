"use strict";
(self["webpackChunkclient"] = self["webpackChunkclient"] || []).push([["common"],{

/***/ 1118:
/*!*********************************************!*\
  !*** ./src/app/shared/models/pagination.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Pagination": () => (/* binding */ Pagination)
/* harmony export */ });
class Pagination {
    constructor() {
        this.pageIndex = 1;
        this.pageSize = 6;
        this.count = 0;
        this.data = [];
    }
}


/***/ }),

/***/ 6487:
/*!*********************************************!*\
  !*** ./src/app/shared/models/shopParams.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShopParams": () => (/* binding */ ShopParams)
/* harmony export */ });
class ShopParams {
    constructor() {
        this.brandName = 'all';
        this.typeName = 'all';
        this.sort = 'name';
        this.pageNumber = 1;
        this.pageSize = 6;
        this.search = '';
    }
}


/***/ }),

/***/ 5085:
/*!**************************************!*\
  !*** ./src/app/shop/shop.service.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShopService": () => (/* binding */ ShopService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common/http */ 8987);
/* harmony import */ var _shared_models_pagination__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/models/pagination */ 1118);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 635);
/* harmony import */ var _shared_models_shopParams__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/models/shopParams */ 6487);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 745);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/environments/environment */ 2340);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 2560);








class ShopService {
    constructor(http) {
        this.http = http;
        this.baseUrl = src_environments_environment__WEBPACK_IMPORTED_MODULE_2__.environment.apiUrl;
        this.products = [];
        this.brands = [];
        this.types = [];
        this.pagination = new _shared_models_pagination__WEBPACK_IMPORTED_MODULE_0__.Pagination();
        this.shopParams = new _shared_models_shopParams__WEBPACK_IMPORTED_MODULE_1__.ShopParams();
        this.productCache = new Map();
    }
    getBrand() {
        if (this.brands.length > 0) {
            return (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.of)(this.brands);
        }
        return this.http.get(this.baseUrl + 'products/brands').pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.map)(response => {
            this.brands = response;
            return response;
        }));
    }
    getType() {
        if (this.types.length > 0) {
            return (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.of)(this.types);
        }
        return this.http.get(this.baseUrl + 'products/types').pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.map)(response => {
            this.types = response;
            return response;
        }));
    }
    getProduct(id) {
        let product;
        this.productCache.forEach((products) => {
            product = products.find(p => p.id === id);
        });
        if (product) {
            return (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.of)(product);
        }
        else {
            return this.http.get(this.baseUrl + 'products/' + id);
        }
    }
    getProducts(useCache) {
        if (!useCache) {
            this.productCache = new Map();
        }
        if (this.productCache.size > 0 && useCache) {
            if (this.productCache.has(Object.values(this.shopParams).join('-'))) {
                this.pagination.data = this.productCache.get(Object.values(this.shopParams).join('-'));
                return (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.of)(this.pagination);
            }
        }
        let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpParams();
        if (this.shopParams.brandName) {
            params = params.append('brandName', this.shopParams.brandName);
        }
        if (this.shopParams.typeName) {
            params = params.append('typeName', this.shopParams.typeName);
        }
        if (this.shopParams.search) {
            params = params.append('search', this.shopParams.search);
        }
        params = params.append('sort', this.shopParams.sort);
        params = params.append('pageIndex', this.shopParams.pageNumber.toString());
        params = params.append('pageSize', this.shopParams.pageSize.toString());
        return this.http
            .get(this.baseUrl + 'products', {
            observe: 'response',
            params,
        })
            .pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.map)((response) => {
            this.productCache.set(Object.values(this.shopParams).join('-'), response.body?.data);
            this.pagination = response.body ?? {};
            return this.pagination;
        }));
    }
    setShopParams(params) {
        this.shopParams = params;
    }
    getShopParams() {
        return this.shopParams;
    }
}
ShopService.ɵfac = function ShopService_Factory(t) { return new (t || ShopService)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpClient)); };
ShopService.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjectable"]({ token: ShopService, factory: ShopService.ɵfac, providedIn: 'root' });


/***/ })

}]);
//# sourceMappingURL=common.js.map