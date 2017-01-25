import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

import { SearchPage } from '../search/search';

@Component({
  selector: 'page-submenu',
  templateUrl: 'submenu.html'
})
export class SubmenuList {
  nCtrl: NavController;
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

    this.nCtrl = this.navParams.get("nCtrl");

   }

  close() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubmenuList');
  }

  selectOption(main, sub) {
    this.viewCtrl.dismiss(
      {
        main: main,
        sub: sub
      }
    );
  }

  search() {
    // this.nCtrl.push(SearchPage);
    this.viewCtrl.dismiss()
      .then(() => {
        this.nCtrl.push(SearchPage);
      });
  }

}
