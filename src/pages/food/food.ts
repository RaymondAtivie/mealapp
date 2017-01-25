import { Component } from '@angular/core';
import { NavController, NavParams, Events, ModalController } from 'ionic-angular';

import { CartPage } from "../../pages/cart/cart";

import { CartService } from "../../providers/cart";

@Component({
  selector: 'page-food',
  templateUrl: 'food.html'
})
export class FoodPage {

  food: any = { vendor: {}, rating: {} };
  cartquantity: number;
  quantity:number = 1;
  animateClass: any = [];
  cartColor: string = "primary";

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public events: Events,
    public cart: CartService,
    public navParams: NavParams
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FoodPage');
    this.food = this.navParams.get("food");
    console.log(this.food);
    this.cartquantity = this.cart.cartNum;
    this.events.subscribe('cart:add', (cartnum) => {
      this.cartquantity = cartnum;
    });
  }

  presentCart() {
    this.navCtrl.push(CartPage);
    console.log("Poping cart");
  }

  addToCart() {
    let item = this.food;

    console.log("add from food");
    console.log(item);

    this.animateClass.push("animated", "pulse");
    this.cartColor = "grey";

    setTimeout(() => {
      this.animateClass.pop();
      this.cartColor = "primary";
    }, 800);

    this.cart.addToCart(item, this.quantity);
    this.cartquantity = this.cart.cartNum;

    this.navCtrl.pop();
  }

  addQuantity(){
    this.quantity = this.quantity + 1;
  }
  removeQuantity(){
    if(this.quantity > 1){
      this.quantity = this.quantity - 1;
    }
  }

  getStarColor(ratenum) {
    if (ratenum <= this.food.rating.rating) {
      return 'mealgreen';
    }
    return 'light';
  }

  camelCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
}
