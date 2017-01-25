import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, MenuController, ToastController, AlertController, Events } from 'ionic-angular';
// import { InAppBrowser } from 'ionic-native';

import { SignupPage } from "../signup/signup";
// import { HomePage } from "../home/home";
import { FoodlistPage } from "../foodlist/foodlist";

import { SetterService } from "../../providers/setter";
import { GetterService } from "../../providers/getter";
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
    private alertCtrl: AlertController,
    private setter: SetterService,
    private getter: GetterService,
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
          this.showToast("Successfully logged in")
            .then(() => {
              this.getter.showRateMeal(this.USER.getUser().data.token);
            })
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
  gotoForgot(email?) {
    if (!email) {
      email = '';
    }
    // new InAppBrowser("http://mealimeter.com/dashboard1/#/reset-password", '_system');
    // this.platform.ready().then(() => {
    // open("http://mealimeter.com/dashboard1/#/reset-password", "_blank", "location=no");
    // });
    // cordova.InAppBrowser.open("http://mealimeter.com/dashboard1/#/reset-password", "_system", "location=true");

    let alert = this.alertCtrl.create({
      title: 'Reset your password',
      message: 'Provide your email address',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email',
          value: email
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Reset',
          handler: data => {
            console.log(data);
            let t = this.showToastNoTime("Sending reset email....");
            t.present();
            this.setter.submit("resetpassword", data)
              .then(result => {
                t.dismiss();

                if (result['error'] == false) {
                  this.showToast("Success! A reset password link has been sent to " + data.email);
                } else {
                  this.showToast(data.email + " - " + result['description']);
                  this.gotoForgot(data.email);
                }
                console.log(result);
              })
            // if (User.isValid(data.username, data.password)) {
            //   // logged in!
            // } else {
            //   // invalid login
            //   return false;
            // }
          }
        }
      ]
    });
    alert.present();
  }

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4500,
      position: "bottom"
    });
    return toast.present();
  }

  showToastNoTime(message) {
    let toast = this.toastCtrl.create({
      message: message,
      position: "bottom"
    });
    return toast;
  }

}
