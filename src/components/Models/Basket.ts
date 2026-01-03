import { IProduct } from "../../types";

export class Basket {
    public items: IProduct[] = [];

    constructor() {}

    public getBasketItems(): IProduct[] {
        return this.items;
    }

    public addItem(item: IProduct): void {
        this.items.push(item);
    }

    public removeItem(item: IProduct): void {
        let index = this.items.findIndex(el => el === item);
        this.items.splice(index, 1);
    }

    public clearBasket(): void {
        this.items = [];
    }

    public getWholePrice(): number {
        let count = 0;
        this.items.forEach(item => {
            if (item.price !== null) {
                count += item.price;
            }
        })
        return count;
    }

    public getItemAmount(): number {
        return this.items.length;
    }

    public checkItem(id: string): boolean {
        if(this.items.find(item => item.id === id) !== undefined) {
            return true;
        }
        return false;
    }
}