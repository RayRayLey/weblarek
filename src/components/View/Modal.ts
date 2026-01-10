import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal>{
    private modalElement: HTMLElement;
    private contentElement: HTMLElement;
    private closeButton: HTMLButtonElement;

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

    open () {
        this.modalElement.classList.add('modal_active');
    }

    close () {
        this.modalElement.classList.remove('modal_active');
    }

    set content(element: HTMLElement) {
        this.contentElement.innerHTML = '';
        this.contentElement.appendChild(element);
    }
}