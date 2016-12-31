import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { OrderDetailPage } from '../order-detail/order-detail';

import { GetterService } from '../../providers/getter';
import { UserService } from '../../providers/user';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {

  history: any = [];
  loading:boolean = false;

  constructor(
    public navCtrl: NavController,
    public getter: GetterService,
    public USER: UserService,
    public navParams: NavParams
  ) {
    this.loadHistory();
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
  }

  loadHistory() {
    this.loading = true;
    let utoken = this.USER.getUser().data.token;

    this.getter.loadlink("getallorders?user_token=" + utoken)
      .then(result => {
        console.log(result);
        this.history = result['data'];
        this.loading = false;
      })
  }

  gotoOrder(order){
    this.navCtrl.push(OrderDetailPage, {order:order});
  }

}
