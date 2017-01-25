import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController, ToastController, AlertController, Events } from 'ionic-angular';
import { StatusBar, Splashscreen, GoogleAnalytics } from 'ionic-native';

import { Push, PushToken } from '@ionic/cloud-angular';

// import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { CartPage } from '../pages/cart/cart';
import { FoodlistPage } from '../pages/foodlist/foodlist';
import { WalletPage } from '../pages/wallet/wallet';
import { HistoryPage } from '../pages/history/history';
import { ReferPage } from '../pages/refer/refer';

// import { InvitecontactPage } from '../pages/invitecontact/invitecontact';
// 
import { UserService } from "../providers/user";
import { GetterService } from "../providers/getter";
import { CartService } from "../providers/cart";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  user: any = { data: {}, officedata: {} };
  cartNum: any = 0;

  pages: Array<{ title: string, component: any, modal?: boolean, badge?: any, icon?: string, }>;

  constructor(
    public platform: Platform,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public USER: UserService,
    public events: Events,
    public getter: GetterService,
    public cart: CartService,
    public push: Push,
    // public deploy: Deploy
  ) {
    this.initializeApp();
    setTimeout(() => {
      console.log("cartnum menu");
      this.cartNum = this.cart.getCartNum();
    }, 1000);
    this.events.subscribe('order:placed', () => {
      this.cartNum = 0;
    });

    // this.initGoogleAnalytics();

    // used for an example of ngFor and navigation
    this.pages = [
      // { title: 'Home', component: HomePage },
      { title: 'Meal List', component: FoodlistPage },
      { title: 'My Cart', component: CartPage, modal: true, badge: 1 },
      { title: 'My Orders', component: HistoryPage },
      { title: 'Get Free Food', component: ReferPage },
      { title: 'Wallet', component: WalletPage },
      // { title: 'Invite', component: InvitecontactPage, modal: true }
    ];

  }

  initGoogleAnalytics() {
    var trackingId = 'UA-89661414-1';
    // if (/(android)/i.test(navigator.userAgent)) { // for android 
    //   trackingId = 'UA-89661414-1';
    // } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
    //   trackingId = 'UA-89661414-1';
    // }

    //platform is injected in the Constructor
    this.platform.ready().then(() => {
      console.log(99);
      GoogleAnalytics.debugMode();
      GoogleAnalytics.startTrackerWithId(trackingId).then(() => {
        console.log("GoogleAnalytics Initialized with ****** : " + trackingId);

        GoogleAnalytics.enableUncaughtExceptionReporting(true)
          .then((_success) => {
            console.log("GoogleAnalytics enableUncaughtExceptionReporting Enabled.");
          }).catch((_error) => {
            console.log("GoogleAnalytics Error enableUncaughtExceptionReporting : " + _error)
          });
      });
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      // this.deploy.check().then((snapshotAvailable: boolean) => {
      //   if (snapshotAvailable) {
      //     // When snapshotAvailable is true, you can apply the snapshot
      //     this.deploy.download().then(() => {
      //       return this.deploy.extract();
      //     }).then(() => {
      //       this.showToast("New update available. Restart your app to get it");
      //     });
      //   }
      // });


      this.USER.auth()
        .then(res => {
          if (res) {
            this.user = res;
            console.log(res);
            this.USER.getbalance()
              .then(balance => this.user.balance = balance);

            this.gotoHome()
              .then(() => {
                this.push.register()
                  .then((t: PushToken) => {
                    return this.push.saveToken(t);
                  }).then((t: PushToken) => {
                    console.log('Token saved:', t.token);
                  });
              });
          } else {
            // document.getElementById("custom-overlay").style.display = "none";
            console.log("Closing splash home");
          }
        });

      this.events.subscribe('user:login', (USER) => {
        this.user = USER;
        this.USER.getbalance()
          .then(balance => this.user.balance = balance);

        this.gotoHome();
      });
      this.events.subscribe('cart:add', (cartnum) => {
        this.cartNum = cartnum;
      });

    });
  }

  gotoHome() {
    // document.getElementById("custom-overlay").style.display = "none";
    console.log("Closing splash foodlist");

    return this.nav.setRoot(FoodlistPage);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    if (!page.modal) {
      this.nav.setRoot(page.component);
    } else {
      this.nav.push(page.component);
      // this.modalCtrl.create(page.component).present();
    }
  }
  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: "bottom"
    });
    toast.present();
  }

  logout() {
    console.log("actual logout");
    this.getter.removeMeals();
    this.cart.destroyCart();
    this.USER.destroyUser()
      .then(() => {
        this.nav.setRoot(HomePage)
          .then(() => {
            this.push.unregister();
          });
      })
  }

  confirmLogout() {
    console.log("confirm logout");
    let alert = this.alertCtrl.create({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.logout();
          }
        }
      ]
    });
    alert.present();
  }
}
