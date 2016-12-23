import { Component } from '@angular/core';
import { NavController, ViewController, ToastController, NavParams, Events } from 'ionic-angular';

import { CartService } from "../../providers/cart";
import { UserService } from "../../providers/user";
import { SetterService } from "../../providers/setter";
import { GetterService } from "../../providers/getter";

declare var PaystackPop: any;

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html'
})
export class CheckoutPage {
  total: number = 0;
  payable: number = 0;
  checkoutdata: any = {};
  company_pay: number = 0;
  loading: boolean = false;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public cart: CartService,
    public setter: SetterService,
    public getter: GetterService,
    public USER: UserService,
    public events: Events,
    public navParams: NavParams) {

    this.total = Number.parseInt(this.navParams.get("total"));
    this.company_pay = Number.parseInt(this.USER.getUser().officedata.office_payment_amount);

    if (this.total > this.company_pay) {
      this.payable = this.total - this.company_pay;
    } else {
      this.payable = 0;
    }

    this.cart.prepareCheckout();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }

  dismiss() {
    return this.viewCtrl.dismiss();
  }

  prepareCheckout() {
    this.cart.prepareCheckout();
    this.checkoutdata = {
      token: this.USER.getUser().data.token,
      office_id: this.USER.getUser().officedata.office_id,
      food_id: this.cart.foodidstring,
      quantity: this.cart.quantitystring,
      total_price: this.total,
      paid: this.payable,
      company_paid: this.company_pay,
      refcode: this.USER.getUser().data.refcode
    }

    console.log(this.checkoutdata);
  }

  placeOrder(method?) {
    this.loading = true;
    this.prepareCheckout();

    if (method) {
      this.checkoutdata.payment_method = method;
    }

    this.setter.submit("makeorder", this.checkoutdata)
      .then((response) => {
        console.log(response);
        if (response['error'] == true) {
          this.showToast("Something went wrong: " + response['description']);
        } else {
          this.events.publish("order:placed");
          this.showToast("Successfully Placed Order");
          this.cart.destroyCart();
          this.dismiss()
            .then(() => {
              this.getter.showRateMeal(this.USER.getUser().data.token);
            });
        }
        this.loading = false;
      });
  }

  payWithWallet() {
    if (this.USER.balance < this.payable) {
      this.showToast("You dont have enough in your wallet. Balance: " + this.USER.balance);
    } else {
      this.placeOrder("Wallet");
    }
  }

  payOnline() {
    this.loading = true;

    this.USER.getAuthCode()
      .then(authcode => {
        console.log(authcode)

        if (authcode) {

          this.setter.chargeReturning(this.USER.getUser().data.email, this.payable * 100, authcode)
            .then(r => {
              console.log(r);

              if (r['status'] == 'error') {
                this.showToast("Something went wrong. Try again");
                this.loading = false;
              } else {
                this.placeOrder("Reused Card");
              }
              console.log(r);
            })

        } else {

          var handler = PaystackPop.setup({
            key: 'pk_live_71b0b2b62aea6d0914aade795f262a100cc72e3c',
            email: this.USER.getUser().data.email,
            amount: this.payable * 100,
            ref: "MM_" + Math.floor(Math.random() * 10000000),
            callback: response => {
              // alert('success. transaction ref is ' + response.reference);
              console.log(response.reference);
              this.getRepeatCode(response.reference);
              this.placeOrder("Card");
            },
            onClose: () => {
              this.showToast('Closed. No transaction was carried out');
              this.loading = false;
            }
          });
          handler.openIframe();

        }

      })

  }

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: "bottom"
    });
    toast.present();
  }

  getRepeatCode(reference) {
    console.log(reference);
    this.setter.getAuthCode(reference)
      .then(authobj => {
        let authcode = authobj['data'].authorization.authorization_code;
        this.USER.saveAuthCode(authcode);
        console.log(authcode);
      })

  }

}
