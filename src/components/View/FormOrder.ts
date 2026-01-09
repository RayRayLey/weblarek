import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";
import { TPayment } from "../../types";

export class FormOrder extends Form{
    addressElement: HTMLInputElement;
    cardButton: HTMLButtonElement;
    cashButton: HTMLButtonElement;
    nextButton: HTMLButtonElement;
    protected payment: TPayment = '';

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.addressElement = ensureElement<HTMLInputElement>('.form[name="order"] .form__input[name="address"]', this.container);
        
        this.cardButton = ensureElement<HTMLButtonElement>('.form[name="order"] .order__buttons [name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('.form[name="order"] .order__buttons [name="cash"]', this.container);
        this.nextButton = ensureElement<HTMLButtonElement>('.form[name="order"] .order__button', this.container);

        this.addressElement.addEventListener('input', () => {
            this.events.emit('address:change');
        });

        this.cardButton.addEventListener('click', () => {
            this.events.emit('payment:card');
        });

        this.cashButton.addEventListener('click', () => {
            this.events.emit('payment:cash');
        });

        this.nextButton.addEventListener('click', (event) => {
            event.preventDefault()
            this.events.emit('contacts:open', event);
        });
    }

    set adress(value: string) {
        this.addressElement.value = value;
    }

    set paymentMethod(value: TPayment) {
        this.payment = value;
    }
}