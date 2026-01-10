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
import { IProduct, OrderList, serverResponce } from './types';


function confirmPrice (price: number | null): string {
    if (price === null) {
        return 'Бесценно';
    } else {
        return String(price) + ' синапсов';
    }   
}

const cardState = {
    buy: 'Купить',
    delete: 'Удалить из корзины',
    disabled: 'Недоступно'
};

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

const display = new Gallery(gallery);

// пустое модальное окно
const modalContainer = document.getElementById('modal-container');
if (!modalContainer) {
    throw new Error('Элемент #modal-container не найден в разметке');
}
const modalElement = new Modal(events, modalContainer);

// добавление данных о товарах в каталог
events.on('items:saved', () => {
    const cards: HTMLElement[] = [];
    const items = testModel.getItems();
    items.forEach((item) => {
        const cardContainer = cloneTemplate<HTMLElement>('#card-catalog');
        const cardCatalog = new CardCatalog(cardContainer, {
            onClick() {
                cardActive(item.id);
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

function cardActive(id: string) {
    itemId = id;
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
            info.buttonStatus = true;
            info.buttonText = cardState.disabled;
        } else if (inBasket) {
            info.buttonText = cardState.delete;
        } else {
            info.buttonText = cardState.buy;
        }

        modalElement.content = previewContainer;
        modalElement.open();
    }
}

events.on('modal:close', () => {
    modalElement.close();
    currentItem = undefined;
    info = undefined;
})

// добавление/удаление товара из корзины
events.on('card:add', () => {
    const inBasket = basketModel.checkItem(itemId);

    if(info && currentItem && !inBasket) {
        basketModel.addItem(currentItem);
        header.counter = basketModel.getItemAmount();
        info.buttonText = cardState.delete;
    } else if (info && currentItem) {
        basketModel.removeItem(currentItem);
        info.buttonText = cardState.buy;
    }
})

// сама корзина
let basketContent: BasketView | undefined = undefined;
let basketElements: HTMLElement[] = [];

events.on('basket:open', () => {
    const basketContainer = cloneTemplate<HTMLElement>('#basket');
    basketContent = new BasketView(events, basketContainer);

    events.emit('basket:change');

    modalElement.content = basketContainer;
    modalElement.open();
})

events.on('basket:change', () => {
    if (!basketContent) return;

    header.counter = basketModel.getItemAmount();

    basketElements = [];
    const basketItems = basketModel.getBasketItems();

    if (basketItems.length === 0) {
        basketContent.buttonStatus = true;
    }

    basketItems.forEach((item, index) => {
        const cardContainer = cloneTemplate<HTMLElement>('#card-basket');
        const cardBasket = new CardBasket(events, cardContainer);

        cardBasket.index = index + 1;
        cardBasket.price = confirmPrice(item.price);
        cardBasket.title = item.title;
        cardBasket.id = item.id;

        basketElements.push(cardContainer);
    });

    basketContent.basketList = basketElements;
    basketContent.price = String(basketModel.getWholePrice()) + ' синапсов';
})

events.on('basket:item:removed', (data: { id: string }) => {
    const id = data.id;
    const item = testModel.findItem(id);

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

    modalElement.content = orderContainer;
    modalElement.open();
})

events.on('address:change', () => {
    if(!order || !buyerModel) return;

    const addressInput =  order.addressElement.value;
    buyerModel.address = addressInput;

    events.emit('order:change');
})

events.on('payment:card', () => {
    if(!order || !buyerModel) return;

    buyerModel.payment = 'online';
    order.cardActive();

    events.emit('order:change');
})

events.on('payment:cash', () => {
    if(!order || !buyerModel) return;

    buyerModel.payment = 'ofline';
    order.cashActive();

    events.emit('order:change');
})

events.on('order:change', () => {
    if(!order || !buyerModel) return;
    const errors = buyerModel.validator();
    const errorMessages: string[] = [];

    if (errors.address) {
        errorMessages.push(errors.address);
        order.nextButtonStatus = true;
    }
    if (errors.payment) {
        errorMessages.push(errors.payment);
        order.nextButtonStatus = true;
    }

    order.formErrors = errorMessages.join('; ');

    if (!errors.payment && !errors.address) {
        order.nextButtonStatus = false;
    }
})

let contactsForm: FormContacts | undefined = undefined;

events.on('contacts:open', () => {
    const contactsContainer = cloneTemplate<HTMLElement>('#contacts');
    contactsForm = new FormContacts(events, contactsContainer);

    modalElement.content = contactsContainer;
    modalElement.open();
})


events.on('email:change', () => {
    if(!contactsForm || !buyerModel) return;

    const emailInput = contactsForm.emailElement.value
    buyerModel.email = emailInput;
    events.emit('contacts:change');
})

events.on('phone:change', () => {
    if(!contactsForm || !buyerModel) return;

    const phoneInput = contactsForm.phoneElement.value;
    buyerModel.phone = phoneInput;
    events.emit('contacts:change');
})

events.on('contacts:change', () => {
    if(!contactsForm || !buyerModel) return;
    const errors = buyerModel.validator();
    const errorMessages: string[] = [];

    if (errors.email) {
        errorMessages.push(errors.email);
        contactsForm.payButtonStatus= true;
    }
    if (errors.phone) {
        errorMessages.push(errors.phone);
        contactsForm.payButtonStatus = true;
    }

    contactsForm.formErrors = errorMessages.join('; ')

    if(!errors.email && !errors.phone) {
        contactsForm.payButtonStatus = false;
    }
})

let successScreen: Success | undefined = undefined;

function closeSuccess() {
    if(!buyerModel) return;
    modalElement.close();
    successScreen = undefined;
    basketModel.clearBasket();
    buyerModel.clearBuyer();
}

function openSuccess(responce: serverResponce) {
    const successContainer = cloneTemplate<HTMLElement>('#success');
    successScreen = new Success(events, successContainer);
    
    successScreen.price = "Списано " + confirmPrice(responce.total);

    modalElement.content = successContainer;
    modalElement.open();

    const modalHandler = () => {
        closeSuccess();
        events.off('modal:close', modalHandler)
    };
    events.on('modal:close', modalHandler);

    const buttonHandler = () => {
        closeSuccess();
        events.off('success:close', buttonHandler);
    };
    events.on('success:close', buttonHandler);
}

events.on('form:send', () => {
    if(!buyerModel || !basketModel) return;

    const orderData: OrderList = {
        payment: buyerModel.payment,
        email: buyerModel.email,
        phone: buyerModel.phone,
        address: buyerModel.address,
        items: basketModel.getBasketItems().map(item => item.id),
        total: basketModel.getWholePrice()
    };

    service.sendData(orderData).then((responce) => {
        openSuccess(responce);
    }).catch((err) => {console.error(err)})
})

events.on('success:close', () => {
    closeSuccess();
})

try {
    const products = await service.getProducts();
    
    testModel.saveItems(products.items); 
} catch (error) {
    console.error(error);
}