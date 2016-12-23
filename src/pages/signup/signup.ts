import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, Events } from 'ionic-angular';

import { LoginPage } from "../login/login";
import { GetterService } from "../../providers/getter";
import { SetterService } from "../../providers/setter";
import { UserService } from "../../providers/user";

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  companies: any = [];
  user: any = {};
  loading: boolean = false;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public getter: GetterService,
    public setter: SetterService,
    public USER: UserService,
    public events: Events,
    public navParams: NavParams
  ) {
    this.getter.loadlink("getCompanies")
      .then(result => {
        console.log(result);
        this.companies = result['companies'];
        console.log(this.companies);
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  gotoLogin() {
    this.navCtrl.push(LoginPage);
  }

  register() {
    console.log(this.user);

    if (this.user.password != this.user.cpassword) {
      this.showToast("Passwords do not match");
      return false;
    }


    if (this.user.password != this.user.cpassword) {
      this.showToast("Passwords do not match");
      return false;
    }

    if (!this.user.firstname || !this.user.email || !this.user.phoneNo || !this.user.password) {
      this.showToast("Please fill your details correctly");
      return false;
    }

    if (!this.user.company) {
      this.showToast("Please select your company");
      return false;
    }

    let userreg = {
      firstname: this.user.firstname,
      email: this.user.email,
      phoneNo: this.user.phoneNo,
      password: this.user.password,
    };

    if (this.user.refcode) {
      userreg['refcode'] = this.user.refcode;
    }
    if (this.user.company !== 'other') {
      userreg['officeid'] = this.user.company;
    } else {

      if (!this.user.officename || !this.user.officeaddress || !this.user.officelocation || !this.user.officeplace) {
        this.showToast("Please fill your office details correctly");
        return false;
      }
      userreg['officename'] = this.user.officename;
      userreg['officeaddress'] = this.user.officeaddress;
      userreg['officelocation'] = this.user.officelocation + " - " + this.user.officeplace;
    }

    this.loading = true;
    this.setter.submit("register", userreg)
      .then(res => {
        console.log(res);
        if (res['error'] == false) {
          this.showToast("Successfully registered.");
          this.USER.loginUser(this.user)
            .then(e => {
              if (e['error'] == true) {
                this.gotoLogin()
              } else {
                this.events.publish('user:login', e['payload']);
                this.showToast("Successfully logged in");
                this.loading = false;
              }
            });
          // this.gotoLogin();
        } else {
          let msg = res['result']['errors'][0];
          this.showToast("Oops! - " + msg);
        }
        this.loading = false;
      });

  }

  loginUser(user) {
    this.setter.submit("login", user)
      .then(res => {
        if (res['error'] == true) {
          // this.errorMessage = res['description'];
          // this.showToast(this.errorMessage);
          // this.user["password"] = "";
          // this.spinner = false;
        } else {
          this.USER.loadUser(res)
            .then(() => {
              this.events.publish('user:login', res);

              this.showToast("Successfully logged in");
              // this.spinner = false;
            });
        }

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
