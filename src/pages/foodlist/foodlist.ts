import { Component, ViewChild, ElementRef } from '@angular/core';
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
  // @ViewChild(foodList) foodContent; 

  stickyTop:boolean = false;
  headerClass: any = "imageFood";
  tabToolClass: any = 'none';
  meal: string;
  cartquantity: number;
  animateClass: any = [];
  cartColor: string = "primary";
  foods: any = [];
  drinks: any = [];
  ionScroll;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public menuCtrl: MenuController,
    public getter: GetterService,
    public cart: CartService,
    public USER: UserService,
    public events: Events,
    public myElement: ElementRef
  ) {
    this.menuCtrl.swipeEnable(true);
    this.meal = "food";
    this.loadMeals();
    this.cartquantity = this.cart.cartNum;
    this.events.subscribe('cart:add', (cartnum) => {
      this.cartquantity = cartnum;
    });
  }

  ngOnInit() {
    // Ionic scroll element

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FoodlistPage');
    this.ionScroll = this.myElement.nativeElement.children[1].children[1];
    console.log(this.ionScroll);
    this.ionScroll.addEventListener("scroll", () => {
      this.sticky_relocate();
    });
  }

  // ngDoCheck(){
  //   this.get
  // }

  selectedTab(text) {
    console.log(text);
    if (text == 'drinks') {
      this.headerClass = "imageDrinks";
    } else {
      this.headerClass = "imageFood";
    }
  }

  // getheaderClass() {
  //   console.log("Header class: "+this.headerClass);
  //   return this.headerClass;
  // }

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
    var window_top = jQuery(window).scrollTop() + 112;
    var div_top = jQuery('#sticky-anchor').offset().top;
    // let div_top = document.getElementById("#sticky-anchor").offsetTop;

    if (window_top > div_top) {
      jQuery('.sticky').addClass('stick');
      this.stickyTop = true;
      console.log(this.stickyTop);
    } else {
      jQuery('.sticky').removeClass('stick');
      this.stickyTop = false;
      console.log(this.stickyTop);
    }
  }

}
