import './scss/styles.scss';
import { Basket } from "./components/Models/Basket";
import { Catalogue } from "./components/Models/Catalogue";
import { Buyer } from "./components/Models/Buyer";
import { ApiService } from './components/Communications/ApiService';
import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { CardBasket } from './components/View/CardBasket';
import { CardCatalog } from './components/View/CardCatalog';
import { BasketView } from './components/View/BasketView';
import { CardPreview } from './components/View/CardPreview';
import { FormContacts } from './components/View/FormContacts';
import { FormOrder } from './components/View/FormOrder';
import { Success } from './components/View/Success';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/Modal';
import { Header } from './components/View/Header';
import { IProduct, OrderList } from './types';


function confirmPrice (price: number | null | undefined): string {
    if (price === null || price === 0 || price === undefined) {
        return 'Бесценно';
    } else{
        return String(price) + ' синапсов';
    }   
}

const cardState: string[] = ['Недоступно', 'Купить', 'Удалить из корзины'];

// запрос на сервер
const api = new Api(API_URL);
const service = new ApiService(api);

// каталог
const events = new EventEmitter();
const testModel = new Catalogue(events);

const basketModel = new Basket(events);

const gallery = document.querySelector<HTMLElement>('.gallery');
if (!gallery) {
    throw new Error('Элемент .gallery не найден в разметке');
}

// шапка
const headerContainer = document.querySelector<HTMLElement>('.header');
if (!headerContainer) {
    throw new Error('Элемент .header не найден в разметке');
}
const header = new Header(events, headerContainer);

//карточки товаров в каталоге
let cards: HTMLElement[] = [];
const display = new Gallery(gallery);

// пустое модальное окно
const modalContainer = document.getElementById('modal-container');
if (!modalContainer) {
    throw new Error('Элемент #modal-container не найден в разметке');
}
let window = new Modal(events, modalContainer);

// добавление данных о товарах в каталог
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


// подробная информация о карточке в модалке
let info: CardPreview | undefined = undefined;
let currentItem: IProduct | undefined = undefined;
let itemId: string = '';

events.on('card:active', (data: { id: string }) => {
    itemId = data.id;
    currentItem = testModel.findItem(itemId);

    const previewContainer = cloneTemplate<HTMLElement>('#card-preview');
    info = new CardPreview(events, previewContainer);

    const inBasket = basketModel.checkItem(itemId);

    if(currentItem) {
        info.title = currentItem.title;
        info.price = confirmPrice(currentItem.price);
        info.category = currentItem.category;
        info.image = currentItem.image;
        info.text = currentItem.description;

        if (currentItem.price === null) {
            info.addToCartButton.disabled = true;
            info.addToCartButton.textContent = cardState[0];
        } else if (inBasket) {
            info.addToCartButton.textContent = cardState[2];
        } else {
            info.addToCartButton.textContent = cardState[1];
        }

        window.content = previewContainer;
        modalContainer.classList.add('modal_active');
    }
})

events.on('modal:close', () => {
    modalContainer.classList.remove('modal_active');
    currentItem = undefined;
    info = undefined;
})

// добавление/удаление товара из корзины
events.on('card:add', () => {
    const inBasket = basketModel.checkItem(itemId);

    if(info && currentItem && !inBasket) {
        basketModel.addItem(currentItem);
        header.counter = basketModel.getItemAmount();
        info.addToCartButton.textContent = cardState[2];
    } else if (info && currentItem) {
        basketModel.removeItem(currentItem);
        info.addToCartButton.textContent = cardState[1];
    }
})

// сама корзина
let basketContent: BasketView | undefined = undefined;
let basketElements: HTMLElement[] = [];

events.on('basket:open', () => {
    const basketContainer = cloneTemplate<HTMLElement>('#basket');
    basketContent = new BasketView(events, basketContainer);

    events.emit('basket:change');

    window.content = basketContainer;
    modalContainer.classList.add('modal_active');
})

events.on('basket:change', () => {
    if (!basketContent) return;

    header.counter = basketModel.getItemAmount();

    basketElements = [];
    const basketItems = basketModel.getBasketItems();

    if (basketItems.length === 0) {
        basketContent.orderButton.disabled = true;
    }

    basketItems.forEach((item, index) => {
        const cardContainer = cloneTemplate<HTMLElement>('#card-basket');
        const cardBasket = new CardBasket(events, cardContainer);

        cardBasket.index = index + 1;
        cardBasket.price = String(item.price) + ' синапсов';
        cardBasket.title = item.title;
        cardBasket.id = item.id;

        basketElements.push(cardContainer);
    });

    basketContent.basketList = basketElements;
    basketContent.price = String(basketModel.getWholePrice()) + ' синапсов';
})

events.on('basket:item:removed', (data: { id: string }) => {
    let id = data.id;
    let item = testModel.findItem(id);
    if(item){
        basketModel.removeItem(item);
    }
    events.emit('basket:change');
})

// форма заказа
let order: FormOrder | undefined = undefined;
let buyerModel: Buyer | undefined = undefined;

events.on('order:start', () => {
    const orderContainer = cloneTemplate<HTMLElement>('#order');
    order = new FormOrder(events, orderContainer);

    buyerModel = new Buyer(events);

    window.content = orderContainer;
    modalContainer.classList.add('modal_active');
})

events.on('address:change', () => {
    if(!order || !buyerModel) return;

    buyerModel.address = order.addressElement.value;

    events.emit('order:change');
})

events.on('payment:card', () => {
    if(!order || !buyerModel) return;

    buyerModel.payment = 'online';
    order?.cardButton.classList.add('button_alt-active');
    order?.cashButton.classList.remove('button_alt-active');

    events.emit('order:change');
})

events.on('payment:cash', () => {
    if(!order || !buyerModel) return;

    buyerModel.payment = 'ofline';
    order?.cashButton.classList.add('button_alt-active');
    order?.cardButton.classList.remove('button_alt-active');

    events.emit('order:change');
})

events.on('order:change', () => {
    if(!order || !buyerModel) return;
    let errors = buyerModel.validator();
    let errorMessages: string[] = [];

    if (errors.address) {
        errorMessages.push(errors.address);
        order.nextButton.disabled = true;
    }
    if (errors.payment) {
        errorMessages.push(errors.payment);
        order.nextButton.disabled = true;
    }

    order.formErrors = errorMessages.join('; ');

    if (!errors.payment && !errors.address) {
        order.nextButton.disabled = false;
    }
})

let contactsForm: FormContacts | undefined = undefined;

events.on('contacts:open', () => {
    const contactsContainer = cloneTemplate<HTMLElement>('#contacts');
    contactsForm = new FormContacts(events, contactsContainer);

    window.content = contactsContainer;
    modalContainer.classList.add('modal_active');
})


events.on('email:change', () => {
    if(!contactsForm || !buyerModel) return;

    buyerModel.email = contactsForm.emailElement.value;
    events.emit('contacts:change');
})

events.on('phone:change', () => {
    if(!contactsForm || !buyerModel) return;

    buyerModel.phone = contactsForm.phoneElement.value;
    events.emit('contacts:change');
})

events.on('contacts:change', () => {
    if(!contactsForm || !buyerModel) return;
    let errors = buyerModel.validator();
    let errorMessages: string[] = [];

    if (errors.email) {
        errorMessages.push(errors.email);
        contactsForm.payButton.disabled = true;
    }
    if (errors.phone) {
        errorMessages.push(errors.phone);
        contactsForm.payButton.disabled = true;
    }

    contactsForm.formErrors = errorMessages.join('; ')

    if(!errors.email && !errors.phone) {
        contactsForm.payButton.disabled = false;
    }
})

let successScreen: Success | undefined = undefined;

events.on('success:open', () => {
    const successContainer = cloneTemplate<HTMLElement>('#success');
    successScreen = new Success(events, successContainer);

    if(!buyerModel || !basketModel) return;

    const orderData: OrderList = {
        payment: buyerModel.payment,
        email: buyerModel.email,
        phone: buyerModel.phone,
        address: buyerModel.address,
        items: basketModel.getBasketItems().map(item => item.id),
        total: basketModel.getWholePrice()
    };

    service.sendData(orderData);
    
    successScreen.price = "Списано " + confirmPrice(basketModel.getWholePrice());

    window.content = successContainer;
    modalContainer.classList.add('modal_active');
})

events.on('success:close', () => {
    if(!buyerModel) return;
    modalContainer.classList.remove('modal_active');
    successScreen = undefined;
    basketModel.clearBasket();
    buyerModel.clearBuyer();
})

try {
    const products = await service.getProducts();
    
    testModel.saveItems(products.items); 
} catch (error) {
    console.error(error);
}