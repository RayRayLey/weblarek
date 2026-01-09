import { ensureElement } from "../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../base/Events";

export class FormContacts extends Form{
    emailElement: HTMLInputElement;
    phoneElement: HTMLInputElement;
    payButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.emailElement = ensureElement<HTMLInputElement>('.form[name="contacts"] .form__input[name="email"]', this.container);
        this.phoneElement = ensureElement<HTMLInputElement>('.form[name="contacts"] .form__input[name="phone"]', this.container);
        this.payButton = ensureElement<HTMLButtonElement>('.form[name="contacts"] .modal__actions .button', this.container);
        
        this.emailElement.addEventListener('input', () => {
            this.events.emit('email:change')
        });

        this.phoneElement.addEventListener('input', () => {
            this.events.emit('phone:change')
        });

        this.payButton.addEventListener('click', (event) => {
            event.preventDefault()
            this.events.emit('success:open', event);
        });
    }

    set email(value: string) {
        this.emailElement.value = value;
    }

    set phone(value: string) {
        this.phoneElement.value = value;
    }
}