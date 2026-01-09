import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
    price: number;
}

export class BasketView extends Component<IBasket>{
    protected priceElement: HTMLElement;
    protected orderButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.orderButton.addEventListener('click', () => {
            this.events.emit('order:start');
        });
    }

    set price(value: number) {
        const defaultprice = this.priceElement.textContent;
        if (value == 0) {
            this.priceElement.textContent = 'Бесценно'; // может перенести в презентер? вроде не должно быть тут
        } else {
            this.priceElement.textContent = defaultprice.replace(/\d+/g, String(value));
        }
    }
}