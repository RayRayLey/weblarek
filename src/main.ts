import { Basket } from "./components/Models/Basket";
import { Catalogue } from "./components/Models/Catalogue";
import { Buyer } from "./components/Models/Buyer";
import { apiProducts } from "./utils/data";

// каталог
const productsModel = new Catalogue();
productsModel.saveItems(apiProducts.items); 

console.log('Массив товаров из каталога: ', productsModel.getItems());

console.log('Элемент по ID: ', productsModel.findItem("412bcf81-7e75-4e70-bdb9-d3c73c9803b7"));

productsModel.saveDetails(apiProducts.items[2]);
console.log('Товар для подробного отображения: ', productsModel.getDetails());

// корзина
const basketModel = new Basket();
basketModel.addItem(apiProducts.items[1]);
basketModel.addItem(apiProducts.items[3]);
console.log('Массив товаров в корзине: ', basketModel.getBasketItems());

basketModel.addItem(apiProducts.items[2]);
console.log('Добавили элемент в массив: ', basketModel.getBasketItems());

basketModel.removeItem(apiProducts.items[3]);
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
