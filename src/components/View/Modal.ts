import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal>{
    protected modalElement: HTMLElement;
    protected contentElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        this.modalElement = container;
        this.modalElement.addEventListener('click', () => {
            this.events.emit('modal:close');
        });

        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        });

        this.contentElement.addEventListener('click', (event) => {
            event.stopPropagation();
        })
    }

    set content(element: HTMLElement) {
        this.contentElement.innerHTML = '';
        this.contentElement.appendChild(element);
    }
}