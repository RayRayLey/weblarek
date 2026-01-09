import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
    price: string;
    basketList: HTMLElement[];
}

export class BasketView extends Component<IBasket>{
    protected priceElement: HTMLElement;
    orderButton: HTMLButtonElement;
    protected basketListElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.basketListElement = ensureElement<HTMLElement>('.basket__list', this.container);

        this.orderButton.addEventListener('click', () => {
            this.events.emit('order:start');
        });
    }

    set price(value: string) {
        this.priceElement.textContent = value;
    }

    set basketList(items: HTMLElement[]) {
        this.basketListElement.innerHTML = '';

        items.forEach(item => {
            this.basketListElement.appendChild(item);
        })
    }
}