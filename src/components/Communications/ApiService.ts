import { IApi, OrderList, ProductsList } from "../../types";
import { ApiPostMethods } from "../../types";
import { serverResponce } from "../../types";

export class ApiService{
    public API: IApi;

    constructor(API: IApi) {
        this.API = API;
    }

    public getProducts(): Promise<ProductsList> {
        return this.API.get<ProductsList>('/product/');
    }
    
    public sendData( data: OrderList, method: ApiPostMethods = 'POST'): Promise<serverResponce> {
        return this.API.post('/order/', data, method);
    }
}