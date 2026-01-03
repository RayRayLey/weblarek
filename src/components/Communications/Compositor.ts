import { IApi, OrderList, ProductsList } from "../../types";
import { ApiPostMethods } from "../../types";

export class Compositor{
    public API: IApi;

    constructor(API: IApi) {
        this.API = API;
    }

    public getProducts(): Promise<ProductsList> {
        return this.API.get<ProductsList>('/product/');
    }

    public sendData( data: OrderList, method: ApiPostMethods = 'POST') {
        return this.API.post('/order/', data, method);
    }
}