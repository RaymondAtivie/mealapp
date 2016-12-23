import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, MenuController, Events, Content } from 'ionic-angular';

import { CartPage } from '../cart/cart';
import { FoodPage } from '../food/food';

import { GetterService } from '../../providers/getter';
import { CartService } from '../../providers/cart';
import { UserService } from '../../providers/user';

import jQuery from "jquery";


@Component({
  selector: 'page-foodlist',
  templateUrl: 'foodlist.html'
})
export class FoodlistPage {

  @ViewChild(Content) content: Content;

  tabToolClass: any = 'none';
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

    setInterval(() => {
    // jQuery(window).scroll(this.sticky_relocate());
      this.sticky_relocate();
    }, 1);

  }


  con() {
    console.log(99);
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

  sticky_relocate() {
    var window_top = jQuery(window).scrollTop() + 56;
    var div_top = jQuery('#sticky-anchor').offset().top;

    if (window_top > div_top) {
      jQuery('#sticky').addClass('stick');
    } else {
      jQuery('#sticky').removeClass('stick');
    }
  }

}
