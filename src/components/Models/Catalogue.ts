import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Catalogue {
    public items: IProduct[] = [];
    public itemDetails: IProduct | undefined;
    
    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    public saveItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('items:saved');
    }

    public getItems(): IProduct[] {
        return this.items;
    }

    public findItem(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }
    
    public saveDetails(item: IProduct): void {
        this.itemDetails = item;
    }

    public getDetails(): IProduct | undefined {
        return this.itemDetails;
    }
}