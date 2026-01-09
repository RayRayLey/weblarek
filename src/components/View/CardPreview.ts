import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";
import { CDN_URL } from "../../utils/constants";

type CategoryKey = keyof typeof categoryMap;
export type TCardPreview = Pick<IProduct, 'image' | 'category' | 'description'>;

export class CardPreview extends Card<TCardPreview>{
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected textElement: HTMLElement;
    addToCartButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.addToCartButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
        

        this.addToCartButton.addEventListener('click', () => {
            this.events.emit('card:add'); // попытка добавить товар в корзину или удалить, если он уже есть
            this.events.emit('modal:close');
        });
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
    
        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(
                categoryMap[key as CategoryKey],
                key === value
            );
        }
    }

    set image(value: string) {
        const fullSrc = CDN_URL + value;
        this.setImage(this.imageElement, fullSrc, this.title);
    }

    set text(value: string) {
        this.textElement.textContent = value;
    }
}