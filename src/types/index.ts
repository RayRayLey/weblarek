import { CardCatalog } from "../components/View/CardCatalog";
import { cloneTemplate } from "../utils/utils";

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type TPayment = 'cash' | 'card' | '';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
} 

export interface ProductsList {
  total: number;
  items: IProduct[];
}

export interface OrderList {
  buyer: IBuyer;
  items: IProduct[];
}

/** 
events.on('catalog:changed', () => {
  const itemCards = productsModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate(CardCatalogTemplate), {
      onClick: () => events.emit('card:select', item),
    });
    return card.render(item);
  });

  gallery.render({ catalog: itemCards });
});

larekApi.getProductList().then((data) => {
  productsModel.setItems(data.items);
}).catch((err) => console.error(err));

**/