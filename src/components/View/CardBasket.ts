import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

type TCardBasket = {
    index: number;
    id: string;
}

export class CardBasket extends Card<TCardBasket>{
    protected indexElement: HTMLElement;
    deleteButton: HTMLButtonElement;
    protected cardId: string = '';

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.deleteButton.addEventListener('click', () => {
            this.events.emit('basket:item:removed', {id: this.cardId});
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }

    set id(value: string) {
        this.cardId = value;
    }
}