import { Component } from '@angular/core';
import { ViewController, ModalController, Events } from 'ionic-angular';

import { CheckoutPage } from '../checkout/checkout';

import { GetterService } from '../../providers/getter';
import { CartService } from '../../providers/cart';
import { UserService } from '../../providers/user';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
  rands: any;
  cartList: any = [];
  totalPrice: number = 0;
  company_pay: number = 0;
  payable: number = 0;

  constructor(
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public getter: GetterService,
    public cart: CartService,
    public USER: UserService,
    public events: Events,
  ) {
    this.cart.getContent()
      .then(cartList => {
        this.cartList = cartList;
      });
    this.totalPrice = this.cart.getTotalPrice();
    this.company_pay = Number.parseInt(this.USER.getUser().officedata.office_payment_amount);
    this.payable = this.getPayable();

    this.getPayable();

    this.events.subscribe("order:placed", () => {
      this.cartList = [];      
      this.totalPrice = 0;
      this.payable = 0;
      this.dismiss();
      console.log("close");
    });
  }

  getPayable() {
    if (this.totalPrice > this.company_pay) {
      this.payable = this.totalPrice - this.company_pay;
    } else {
      this.payable = 0;
    }
    return this.payable;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
    this.getRands();
  }

  getRands() {
    this.getter.load()
      .then(data => {
        this.rands = data;
        console.log(this.rands);
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  presentCheckout() {
    let data = { total: this.cart.getTotalPrice() };

    console.log(data);

    this.modalCtrl.create(CheckoutPage, data).present();
  }

  addToCart(item) {
    this.cart.addToCart(item);
    this.totalPrice = this.cart.getTotalPrice();
  }

  removeFromCart(item) {
    this.cart.removeFromCart(item);
    this.totalPrice = this.cart.getTotalPrice();
  }

}
