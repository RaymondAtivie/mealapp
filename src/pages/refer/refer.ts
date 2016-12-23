import { Component } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';
import { SocialSharing } from 'ionic-native';

import { UserService } from '../../providers/user';

@Component({
  selector: 'page-refer',
  templateUrl: 'refer.html'
})
export class ReferPage {

  refcode: any = "";

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public USER: UserService
  ) {
    this.refcode = this.USER.getUser().data.refcode;
    console.log(this.refcode);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReferPage');
  }

  shareCode() {
    var options = {
      message: "Hey sign up on mealimeter with this code " + this.refcode, // not supported on some apps (Facebook, Instagram)
      subject: 'Free Food', // fi. for email
      chooserTitle: 'Invite your Colleague' // Android only, you can override the default share sheet title
    }

    SocialSharing.shareWithOptions(options)
      .then(() => {
        // this.showToast("Successfully shared");
      }).catch(() => {
        this.showToast("Something went wrong");
      });
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
