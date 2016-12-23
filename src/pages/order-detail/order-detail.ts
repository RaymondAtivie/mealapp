import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';

import { OrderRatePage } from '../order-rate/order-rate';

@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html'
})
export class OrderDetailPage {
  order:any = {};

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams) {
    this.order = this.navParams.get("order");

    console.log(this.order);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
    console.log(this.order);
  }

  showRate(){
    this.modalCtrl.create(OrderRatePage, {order:this.order}).present();
  }

}
