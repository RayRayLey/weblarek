import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

export class FormOrder extends Form{
    protected adressElement: HTMLInputElement;
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected nextButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.adressElement = ensureElement<HTMLInputElement>('.form__input', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.order__buttons [name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('.order__buttons [name="cash"]', this.container);
        this.nextButton = ensureElement<HTMLButtonElement>('.order__button', this.container);

        this.cardButton.addEventListener('click', () => {
            this.events.emit('payment:card');
        });

        this.cashButton.addEventListener('click', () => {
            this.events.emit('payment:cash');
        });

        this.nextButton.addEventListener('click', () => {
            this.events.emit('order:close');
            this.events.emit('contacts:open');
        });
    }

    set adress(value: string) {
        this.adressElement.value = value;
    }
}