import { ensureElement } from "../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../base/Events";

export class FormContacts extends Form{
    protected emailElement: HTMLElement;
    protected phoneElement: HTMLElement;
    protected payButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.emailElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.phoneElement = ensureElement<HTMLElement>('.basket__item-delete', this.container);
        this.payButton = ensureElement<HTMLButtonElement>('.button', this.container);

        this.payButton.addEventListener('click', () => {
            this.events.emit('success:open');
        });
    }

    set email(value: string) {
        this.emailElement.textContent = value;
    }

    set phone(value: string) {
        this.phoneElement.textContent = value;
    }
}