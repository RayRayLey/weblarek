import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ICard {
    title: string;
    price: string;
}

export class Card<ICard> extends Component<ICard>{
    protected priceElement: HTMLElement;
    protected titleElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
        this.titleElement = ensureElement<HTMLButtonElement>('.card__title', this.container);
    }
    
    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: string) {
        this.priceElement.textContent = value;
    }
}