import { Component } from "../base/Component";

interface IGallery {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery>{
    private catalogElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.catalogElement = this.container;
    }

    set catalog(items: HTMLElement[]) {
        this.catalogElement.innerHTML = '';
        items.forEach(item => {
            this.catalogElement.appendChild(item);
        })
    }
}