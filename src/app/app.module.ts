import { NgModule, ErrorHandler } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { HomePage } from '../pages/home/home';
import { FoodlistPage } from '../pages/foodlist/foodlist';
import { WalletPage } from '../pages/wallet/wallet';
import { FoodPage } from '../pages/food/food';
import { CartPage } from '../pages/cart/cart';
import { CheckoutPage } from '../pages/checkout/checkout';
import { HistoryPage } from '../pages/history/history';
import { ReferPage } from '../pages/refer/refer';
import { OrderDetailPage } from '../pages/order-detail/order-detail';
import { OrderRatePage } from '../pages/order-rate/order-rate';

import { GetterService } from '../providers/getter';
import { SetterService } from '../providers/setter';
import { UserService } from '../providers/user';
import { CartService } from '../providers/cart';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '338fad64'
  },
  'push': {
    'sender_id': '920910510371',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    HomePage,
    FoodlistPage,
    FoodPage,
    ReferPage,
    CartPage,
    WalletPage,
    CheckoutPage,
    HistoryPage,
    OrderDetailPage,
    OrderRatePage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
            mode: "md"
            // backButtonText: ' ',
            // backButtonIcon: 'arrow-round-back',
        }),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    HomePage,
    FoodlistPage,
    FoodPage,
    ReferPage,
    CartPage,
    WalletPage,
    CheckoutPage,
    HistoryPage,
    OrderDetailPage,
    OrderRatePage
  ],
  providers: [
    Storage,
    UserService,
    GetterService,
    SetterService,
    CartService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
