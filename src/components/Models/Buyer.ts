import { TPayment } from "../../types";
import { EventEmitter } from "../base/Events";

export class Buyer {
    public payment: TPayment | '' = '';
    public address: string = '';
    public phone: string = '';
    public email: string = '';
    
    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }
    
    public saveBuyer(
        payment: TPayment | '' = '',
        address: string  = '',
        phone: string  = '',
        email: string  = ''
    ): void {
        if(payment !== '') this.payment = payment;
        if(address !== '') this.address = address;
        if(phone !== '') this.phone = phone;
        if(email !== '') this.email = email;
        this.events.emit('buyer:saved');
    }
    
    public getBuyer(): {payment: TPayment | '', address?: string, phone?: string, email?: string} {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email
        };
    }

    public clearBuyer(): void {
        this.payment = '';
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    public validator(): {payment?: string, address?: string, phone?: string, email?: string} {
        let errors: {payment?: string, address?: string, phone?: string, email?: string} = {};
        if(this.payment === '') {
            errors.payment = 'Не выбран вид оплаты';
        }

        if(this.address === '') {
            errors.address = 'Укажите адрес доставки';
        }

        if(this.phone === '') {
            errors.phone = 'Укажите номер для связи';
        }

        if(this.email === '') {
            errors.email = 'Укажите емэйл';
        }

        return errors;
    }
}