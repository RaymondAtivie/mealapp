import { Component } from '@angular/core';
import { NavController, ViewController, ToastController, NavParams } from 'ionic-angular';

import { SetterService } from '../../providers/setter';
import { UserService } from '../../providers/user';

@Component({
  selector: 'page-order-rate',
  templateUrl: 'order-rate.html'
})
export class OrderRatePage {

  order: any = {};
  title: string = "Rate these meals";
  ratings: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public setter: SetterService,
    public USER: UserService,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController
  ) {
    this.order = this.navParams.get("order");
    this.title = this.navParams.get("title");
    console.log(this.order);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderRatePage');
  }

  dismiss() {
    this.viewCtrl.dismiss()
  }

  setRating(foodid, ratenum) {
    this.ratings[foodid] = ratenum;
    console.log(foodid);
    console.log(ratenum);
    console.log(this.ratings);
  }

  getStarColor(foodid, ratenum) {
    if (this.ratings[foodid]) {
      if (ratenum <= this.ratings[foodid]) {
        return 'mealgreen';
      }
      return 'light';
    }
    return 'light';
  }

  submitRating() {
    let ratingdata = {
      token: this.USER.getUser().data.token,
      order_id: this.order.batch,
      ratings: JSON.stringify(this.ratings)
    }

    console.log(ratingdata);
    
    this.setter.submit("addrating", ratingdata)
    .then(result => {
      console.log(result);
    });

    this.showToast("Thank you! For rating these meals");
    this.dismiss();
  }

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: "bottom"
    });
    toast.present();
  }

}
