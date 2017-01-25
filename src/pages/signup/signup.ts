import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, AlertController, NavParams, Events } from 'ionic-angular';

import { LoginPage } from "../login/login";
import { GetterService } from "../../providers/getter";
import { SetterService } from "../../providers/setter";
import { UserService } from "../../providers/user";

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  @ViewChild('fName') fNameInput;
  @ViewChild('email') emailInput;
  @ViewChild('phone') phoneInput;
  @ViewChild('password') passwordInput;

  @ViewChild('officename') officenameInput;
  @ViewChild('officeaddress') officeaddressInput;
  @ViewChild('officelocation') officelocationInput;

  companies: any = [];
  comps: any = [];
  user: any = {};
  loading: boolean = false;
  stage: number = 2;
  locations = [];
  workplaceload = false;
  showWorkForm = false;
  fresh: boolean = false;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public getter: GetterService,
    public setter: SetterService,
    public USER: UserService,
    public events: Events,
    public navParams: NavParams
  ) {
    this.workplaceload = true;
    // this.getter.loadlink("getCompanies")
    //   .then(result => {
    //     console.log(result);
    //     this.comps = result['companies'];
    //     this.companies = result['companies'];
    //     console.log(this.companies);

    //     this.workplaceload = false;
    //   });

    this.getter.loadCompanies()
      .then(companies => {
        this.comps = companies;
        // this.companies = companies;

        console.log(companies);

        this.workplaceload = false;
      });

    this.initializeLocation();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  initializeLocation() {
    this.locations = ["Yaba", "Surulere", "Ikeja", "Victoria Island", "Lekki Phase 1", "Ikoyi"];
  }
  initializeCompanies() {
    this.companies = this.comps;
  }

  searchLocation(ev: any) {
    // Reset items back to all of the items
    this.initializeLocation();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.locations = this.locations.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  chooseLocation(location) {
    this.user.officeplace = location;
    this.user.company = "other";
    this.showWorkForm = true;
    this.stage = 3;
    this.next();
  }

  searchWorkplace(ev: any) {
    this.fresh = true;

    this.initializeCompanies();

    let val = ev.target.value;

    let cname, clocation, if1, if2;
    this.companies = this.companies.filter((company) => {
      cname = company.name;
      clocation = company.location;

      if1 = cname.toLowerCase().indexOf(val.toLowerCase()) > -1;
      if2 = clocation.toLowerCase().indexOf(val.toLowerCase()) > -1;

      return if1 || if2;
    });
  }

  chooseCompany(company) {
    this.user.officename = company.name;
    this.user.officelocation = company.location;
    this.user.officeaddress = company.address;
    this.user.company = company.id;
    this.user.companyselected = true;

    console.log(this.user);

    this.stage = 3;
    this.next();

  }

  noCompany() {
    this.stage = 1;
    this.user = {};
  }

  changeWorkplace() {
    this.stage = 2;
    this.prev();
  }

  showNoLocation() {
    let alert = this.alertCtrl.create({
      title: "We don't cover your area yet",
      message: "We'd let you know when we do",
      inputs: [
        {
          name: 'Email',
          placeholder: 'Email address',
          type: 'email'
        },
        {
          name: 'Location',
          placeholder: 'Location',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log(data);
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            console.log(data);
            return true;
          }
        }
      ]
    });
    alert.present();
  }

  gotoLogin() {
    this.navCtrl.push(LoginPage);
  }

  register() {
    console.log(this.user);

    let x = this.user.email;
    if (!x) {
      x = "";
    }
    console.log(x);
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");


    if (!this.user.firstname) {
      this.showToast("Please fill your full name correctly")
        .then(() => {
          this.fNameInput.setFocus();
        });
      return false;
    } else if (!this.user.email) {
      this.showToast("Please fill your email correctly")
        .then(() => {
          this.emailInput.setFocus();
        });
      return false;
    } else if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
      this.showToast("Please enter a valid email address")
        .then(() => {
          this.emailInput.setFocus();
        });
      return false;

    } else if (!this.user.phoneNo) {
      this.showToast("Please fill your phone number correctly")
        .then(() => {
          this.phoneInput.setFocus();
        });
      return false;
    } else if (!this.user.password) {
      this.showToast("Password field is required")
        .then(() => {
          this.passwordInput.setFocus();
        });
      return false;
    }

    if (this.user.password != this.user.cpassword) {
      this.showToast("Passwords do not match")
        .then(() => {
          this.passwordInput.setFocus();
        })
      return false;
    }

    if (!this.user.company) {
      this.showToast("Please fill your company details");
      return false;
    }

    console.log(this.user.dob);
    
    let userreg = {
      firstname: this.user.firstname,
      email: this.user.email,
      phoneNo: this.user.phoneNo,
      password: this.user.password,
      dob: this.user.dob,
    };

    if (this.user.refcode) {
      userreg['refcode'] = this.user.refcode;
    }
    if (this.user.company !== 'other') {
      userreg['officeid'] = this.user.company;
    } else {

      if (!this.user.officename || !this.user.officeaddress || !this.user.officelocation || !this.user.officeplace) {
        this.showToast("Please fill your office details correctly")
          .then(() => {
            if (!this.user.officename) {
              this.officenameInput.setFocus();
            } else if (!this.user.officeaddress) {
              this.officeaddressInput.setFocus();
            } else if (!this.user.officelocation) {
              this.officelocationInput.setFocus();
            }
          });
        return false;
      }
      if (this.user.companyselected) {
        userreg['officelocation'] = this.user.officelocation;
      }
      userreg['officename'] = this.user.officename;
      userreg['officeaddress'] = this.user.officeaddress;
      userreg['officelocation'] = this.user.officelocation + " - " + this.user.officeplace;
    }

    if (this.user.refcode) {
      this.getter.loadlink("confirmrefcode?refcode=" + this.user.refcode)
        .then(result => {
          if (result['error'] == false) {
            if (result['result'] == false) {
              this.showToast("Invalid refferal code");
              return false;
            } else {
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
          }

        })
    }else{
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

    // console.log("registered!!");

    // this.loading = true;
    // this.setter.submit("register", userreg)
    //   .then(res => {
    //     console.log(res);
    //     if (res['error'] == false) {
    //       this.showToast("Successfully registered.");
    //       this.USER.loginUser(this.user)
    //         .then(e => {
    //           if (e['error'] == true) {
    //             this.gotoLogin()
    //           } else {
    //             this.events.publish('user:login', e['payload']);
    //             this.showToast("Successfully logged in");
    //             this.loading = false;
    //           }
    //         });
    //       // this.gotoLogin();
    //     } else {
    //       let msg = res['result']['errors'][0];
    //       this.showToast("Oops! - " + msg);
    //     }
    //     this.loading = false;
    //   });

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
    return toast.present();
  }

  next() {
    // this.signupSlider.slideNext();
  }

  prev() {
    // this.signupSlider.slidePrev();
  }

}
