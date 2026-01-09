import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ISuccess {
    price: string;
}

export class Success extends Component<ISuccess>{
    protected priceElement: HTMLElement;
    protected successButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.priceElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.successButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.successButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set price(value: string) {
        this.priceElement.textContent = value;
    }
}