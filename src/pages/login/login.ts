import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, MenuController, ToastController, Events } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { SignupPage } from "../signup/signup";
// import { HomePage } from "../home/home";
import { FoodlistPage } from "../foodlist/foodlist";

import { SetterService } from "../../providers/setter";
import { UserService } from "../../providers/user";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  user: Object = {};
  spinner: boolean = false;
  errorMessage: any;

  constructor(
    public navCtrl: NavController,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController,
    private setter: SetterService,
    public storage: Storage,
    public USER: UserService,
    public events: Events,
  ) {
  }

  ionViewDidLoad() {
    this.menuCtrl.swipeEnable(false);
  }



  login() {

    this.spinner = true;
    this.errorMessage = false;

    this.USER.loginUser(this.user)
      .then(e => {
        if (e['error'] == true) {
          this.errorMessage = e['description'];
          this.showToast(this.errorMessage);
          this.user["password"] = "";
          this.spinner = false;
        } else {
          this.events.publish('user:login', e['payload']);
          this.showToast("Successfully logged in");
          this.spinner = false;
        }
      });
  }

  gotoHome() {
    this.navCtrl.setRoot(FoodlistPage);
  }
  gotoSignup() {
    this.navCtrl.push(SignupPage);
  }
  gotoForgot() {
    let browser = new InAppBrowser("http://mealimeter.com/dashboard1/#/reset-password", '_system');
    // this.platform.ready().then(() => {
    // open("http://mealimeter.com/dashboard1/#/reset-password", "_blank", "location=no");
    // });
    // cordova.InAppBrowser.open("http://mealimeter.com/dashboard1/#/reset-password", "_system", "location=true");
  }

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "bottom"
    });
    toast.present();
  }

}
