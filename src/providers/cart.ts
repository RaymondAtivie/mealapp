import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';

@Injectable()
export class CartService {

  cart: any = [];
  totalPrice: number = 0;
  cartNum = 0;
  foodidstring: string;
  quantitystring: string;

  constructor(public http: Http, public storage: Storage, public events: Events) {
    console.log('Hello Cart Provider');
    this.getContent();

    this.cart = [];

    this.events.subscribe("order:placed", () => {
      this.destroyCart();      
    });
  }

  getContent() {
    return new Promise(resolve => {
      if (!this.cart) {
        this.storage.get("cart")
          .then(cart => {
            console.log(cart);
            if (cart) {
              this.cart = cart;
            } else {
              this.cart = [];
            }
            this.cartNum = this.cart.length;
            this.calculateTotal();
            resolve(this.cart);
          });
      } else {
        this.cartNum = this.cart.length;
        this.calculateTotal();
        resolve(this.cart);
      }
    });
  }

  prepareCheckout() {
    let foodid = [];
    let quantity = [];
    this.cart.forEach(crt => {
      console.log(crt);
      foodid.push(crt.id);
      quantity.push(crt.quantity);
    });

    this.foodidstring = foodid.join(";");
    this.quantitystring = quantity.join(";");
  }

  getCartNum() {
    return this.cartNum;
  }

  getTotalPrice() {
    return this.totalPrice;
  }

  recalculateTotal(newprice) {
    this.totalPrice += Number.parseInt(newprice);
    console.log(this.totalPrice);
    this.cartNum = this.cart.length;
    this.events.publish('cart:add', this.cartNum);
    this.storeInStorage();
  }

  calculateTotal() {
    let p = 0;
    this.cart.forEach(crt => {
      console.log(crt);
      p += Number.parseInt(crt.price);
    });

    this.totalPrice = p;
    return p;
  }

  storeInStorage() {
    this.storage.set("cart", this.cart)
      .then(() => {
        console.log("cart has been stored");
      })
  }

  addToCart(item, quant?) {
    if(!quant){
      let quant = 1;
    }
    var option = {
      id: item.id,
      mainmeal: item.main,
      name: item.name,
      price: Number.parseInt(item.price),
      quantity: Number.parseInt(quant),
      food: item
    }

    var first_time = true;
    var already_id = null;

    console.log(this.cart);

    //Check if the item already existed
    for (var i = 0; i < this.cart.length; i++) {
      if (option.id === this.cart[i].id) {
        first_time = false;
        already_id = i;
      }
    }
    var quantity = 0;
    //if it doesnt exist add to cart for the first time
    if (first_time) {
      quantity = quant;
      this.cart.push(option);
    }
    //else just increase the quantity and price of the old one 
    else {
      var olditem = this.cart[already_id];
      var newquantity = olditem.quantity + quant;
      olditem.price = (olditem.price / olditem.quantity) * newquantity;
      olditem.quantity = newquantity;
      quantity = newquantity;
      this.cart[already_id] = olditem;
    }
    console.log(this.cart);
    this.recalculateTotal(item.price);
  }

  removeFromCart(item) {
    var exist = false;
    var already_id = null;

    //Check if the item already existed
    for (var i = 0; i < this.cart.length; i++) {
      if (item.id === this.cart[i].id) {
        exist = true;
        already_id = i;
      }
    }

    //if it exist
    if (exist) {
      var olditem = this.cart[already_id];
      //if the quantity is more than one remove only one quantity and reduce price
      if (olditem.quantity > 1) {
        var newquantity = olditem.quantity - 1;
        olditem.price = (olditem.price / olditem.quantity) * newquantity;
        olditem.quantity = newquantity;
        this.cart[already_id] = olditem;
        // toastr.warning("One quantity of " + item.name + " has been removed to cart. " + newquantity + "x remaining", "Removed from cart");
      }
      //else remove the whole thing
      else {
        this.cart.splice(already_id, 1);
        // toastr.error(item.name + " has been removed from cart", "removed from cart");
      }
    } else {
      // toastr.info("it wasn't in the cart");
    }
    this.recalculateTotal(-Number.parseInt(item.price));
  }

  destroyCart() {
    this.storage.remove("cart")
      .then(() => {
        this.cart = [];
        this.cartNum = 0;
        this.totalPrice = 0;
        this.foodidstring = "";
        this.quantitystring = "";
      })
  }
}
