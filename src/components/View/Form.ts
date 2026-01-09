import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IForm {
    formErrors: string;
}

export class Form extends Component<IForm>{
    protected formElement: HTMLElement;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.formElement = ensureElement<HTMLElement>('.order', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
    }

    set formErrors(error: string) {
        this.errorsElement.textContent = String(error);
    }
}