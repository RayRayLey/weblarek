import './scss/styles.scss';
import { Basket } from "./components/Models/Basket";
import { Catalogue } from "./components/Models/Catalogue";
import { Buyer } from "./components/Models/Buyer";
import { ApiService } from './components/Communications/ApiService';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { Card } from './components/View/Card';
import { EventEmitter } from './components/base/Events';
import { CardBasket } from './components/View/CardBasket';
import { CardCatalog } from './components/View/CardCatalog';
import { BasketView } from './components/View/BasketView';
import { CardPreview } from './components/View/CardPreview';
import { FormContacts } from './components/View/FormContacts';
import { FormOrder } from './components/View/FormOrder';
import { Success } from './components/View/Success';
import { cloneTemplate } from './utils/utils';
import { IProduct } from './types';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/Modal';

function confirmPrice (price: number | null): string {
    if (price === null || price === 0) {
        return 'Бесценно';
    } else{
        return String(price) + ' синапсов';
    }   
}

// запрос на сервер
const api = new Api(API_URL);
const service = new ApiService(api);

// каталог
const events = new EventEmitter();
const testModel = new Catalogue(events);

const basketModel = new Basket();

const gallery = document.querySelector<HTMLElement>('.gallery');
if (!gallery) {
    throw new Error('Элемент .gallery не найден в разметке');
}

let cards: HTMLElement[] = [];
const display = new Gallery(gallery);

events.on('items:saved', () => {
    const items = testModel.getItems();
    items.forEach((item) => {
        const cardContainer = cloneTemplate<HTMLElement>('#card-catalog');
        const cardCatalog = new CardCatalog(cardContainer, {
            onClick() {
                events.emit('card:active', { id: item.id })
            },
        });
        cardCatalog.category = item.category;
        cardCatalog.price = confirmPrice(item.price);
        cardCatalog.image = item.image;
        cardCatalog.title = item.title;
        cards.push(cardContainer);
    });

    display.render({ catalog: cards });
})


events.on('card:active', (data: { id: string }) => {
    const item = testModel.findItem(data.id);
    const modalContainer = document.getElementById('modal-container');
    const previewContainer = cloneTemplate<HTMLElement>('#card-preview');
    let info = new CardPreview(events, previewContainer);
    if(item) {
        info.title = item.title;
        info.price = confirmPrice(item.price);
        if (item.price === null) {
            info.addToCartButton.disabled = true;
            info.addToCartButton.textContent = 'Недоступно';
        }
        info.category = item.category;
        info.image = item.image;
        info.text = item.description;

        if (modalContainer) {
            let window = new Modal(events, modalContainer);
            window.content = previewContainer;
            modalContainer.classList.add('modal_active');
            events.on('modal:close', () => {
                modalContainer.classList.remove('modal_active');
            })

            events.on('card:add', () => {
                modalContainer.classList.remove('modal_active');
                basketModel.addItem(item);
            })
        }
    }
})

try {
    const products = await service.getProducts();
    
    testModel.saveItems(products.items); 
} catch (error) {
    console.error(error);
}

/** console.log('Массив товаров из каталога: ', testModel.getItems());

console.log('Элемент по ID: ', testModel.findItem("412bcf81-7e75-4e70-bdb9-d3c73c9803b7"));

testModel.saveDetails(testModel.items[2]);
console.log('Товар для подробного отображения: ', testModel.getDetails());

// корзина
const basketModel = new Basket();
basketModel.addItem(testModel.items[1]);
basketModel.addItem(testModel.items[8]);
console.log('Массив товаров в корзине: ', basketModel.getBasketItems());

basketModel.addItem(testModel.items[3]);
console.log('Добавили элемент в массив: ', basketModel.getBasketItems());

basketModel.removeItem(testModel.items[1]);
console.log('Убрали элемент из массива: ', basketModel.getBasketItems());

console.log('Количество товаров в корзине: ', basketModel.getItemAmount());

console.log('Цена товаров в корзине: ', basketModel.getWholePrice());

console.log('Проверяем, есть ли элемент по ID(такой есть): ', basketModel.checkItem("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"));
console.log('Проверяем, есть ли элемент по ID(такого уже нет): ', basketModel.checkItem("854cef69-976d-4c2a-a18c-2aa45046c390"));

basketModel.clearBasket();
console.log('Очистили корзину: ', basketModel.getBasketItems());

// покупатель
const buyerModel = new Buyer();
buyerModel.saveBuyer(buyerModel.payment = 'card', buyerModel.address = 'I live here');

console.log('Заполненная информация о покупателе: ', buyerModel.getBuyer());
console.log('Тут валидатор будет ругаться: ', buyerModel.validator());

buyerModel.clearBuyer();
console.log('Очистили информацию о покупателе: ', buyerModel.getBuyer());

console.log('Тут валидатор тоже будет ругаться: ', buyerModel.validator());

buyerModel.saveBuyer(buyerModel.payment = 'cash', buyerModel.address = 'I live here', buyerModel.email = "noyb@gmail.com", buyerModel.phone = "+7***");
console.log('Заполнили полностью: ', buyerModel.getBuyer());
console.log('Ошибок не будет: ', buyerModel.validator());

 hnking
const productArray = testModel.items;

const gallery = document.querySelector<HTMLElement>('.gallery');
if (!gallery) {
    throw new Error('Элемент .gallery не найден в разметке');
}
 это кстати даже останется вроде
const template = document.getElementById('card-catalog') as HTMLTemplateElement;

productArray.forEach(product => {
    const clone = document.importNode(template.content, true);
    const container = clone.querySelector('.gallery__item') as HTMLElement;

    const cardCatalog = new CardCatalog(container);
    cardCatalog.category = product.category;
    cardCatalog.price = product.price ?? 0;
    cardCatalog.image = product.image;
    cardCatalog.title = product.title;

    gallery.appendChild(clone);
});
**/


