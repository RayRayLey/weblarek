import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IForm {
    fields: HTMLElement[];
}

export class Form extends Component<IForm>{
    protected formElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.formElement = ensureElement<HTMLElement>('.order', this.container);

    }

    set fields(items: HTMLElement[]) {
        items.forEach((item) => {
            this.formElement.appendChild(item);
        })
    }
}