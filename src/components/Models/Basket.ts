import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Basket {
    public items: IProduct[] = [];


    private events: EventEmitter;
    
    constructor(events: EventEmitter) {
        this.events = events;
    }

    public getBasketItems(): IProduct[] {
        return [...this.items];
    }

    public addItem(item: IProduct): void {
        this.items.push(item);
        this.events.emit('basket:change');
    }

    public removeItem(item: IProduct): void {
        let index = this.items.findIndex(el => el.id === item.id);
        this.items.splice(index, 1);
        this.events.emit('basket:change');
    }

    public clearBasket(): void {
        this.items = [];
        this.events.emit('basket:change');
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