import { IProduct } from "../../types";

export class Catalogue {
    public items: IProduct[] = [];
    public itemDetails: IProduct | undefined;
    
    constructor() {}

    public saveItems(items: IProduct[]): void {
        this.items = items;
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