import { Component } from '@angular/core';
import { NavController, ModalController, MenuController, Events } from 'ionic-angular';

import { CartPage } from '../cart/cart';
import { FoodPage } from '../food/food';

import { GetterService } from '../../providers/getter';
import { CartService } from '../../providers/cart';
import { UserService } from '../../providers/user';


@Component({
  selector: 'page-foodlist',
  templateUrl: 'foodlist.html'
})
export class FoodlistPage {

  meal: string;
  cartquantity: number;
  animateClass: any = [];
  cartColor: string = "primary";
  foods: any = [];
  drinks: any = [];

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public menuCtrl: MenuController,
    public getter: GetterService,
    public cart: CartService,
    public USER: UserService,
    public events: Events,
  ) {
        this.menuCtrl.swipeEnable(true);
    this.meal = "food";
    this.loadMeals();
    this.cartquantity = this.cart.cartNum;
    this.events.subscribe('cart:add', (cartnum) => {
      this.cartquantity = cartnum;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FoodlistPage');
  }

  loadMeals() {
    console.log("getting meals");
    this.getter.getMeals(this.USER.getUser().officedata.office_id)
      .then(meals => {
        console.log(meals);
        this.foods = meals['food'];
        this.drinks = meals['drinks'];
      });
  }

  presentCart() {
    this.navCtrl.push(CartPage);
    // this.modalCtrl.create(CartPage).present();
    console.log("Poping cart");
  }

  gotoFood(food) {
    this.navCtrl.push(FoodPage, {
      food: food
    });
  }

  addToCart(item) {
    this.animateClass.push("animated", "pulse");
    this.cartColor = "grey";

    setTimeout(() => {
      this.animateClass.pop();
      this.cartColor = "mealgreen";
    }, 800);

    this.cart.addToCart(item);
    this.cartquantity = this.cart.cartNum;
  }

  getStarColor(rating, itemnum) {
    if (itemnum <= rating) {
      return 'mealgreen';
    }
    return 'light';
  }

}
