import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';

import { UserService } from '../../providers/user';
import { SetterService } from '../../providers/setter';

declare var PaystackPop: any;

@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html'
})
export class WalletPage {
  balance: any;
  loading = false;
  amount: any = false;
  constructor(public toastCtrl: ToastController, public setter: SetterService, public USER: UserService) { }


  ionViewDidLoad() {
    this.balance = this.USER.balance;
    console.log('ionViewDidLoad WalletPage');
  }

  topUp() {
    if(!this.amount || this.amount < 1){
      this.showToast("Amount must be greater than 0");
      return false;
    }
    this.loading = true;

    this.USER.getAuthCode()
      .then(authcode => {
        console.log(authcode)

        if (authcode) {

          this.setter.chargeReturning(this.USER.getUser().data.email, this.amount * 100, authcode)
            .then(r => {
              console.log(r);

              if (r['status'] == 'error') {
                this.showToast("Something went wrong. Try again");
                this.loading = false;
              } else {
                this.topUpWallet();
              }
              console.log(r);
            })

        } else {

          var handler = PaystackPop.setup({
            key: 'pk_live_71b0b2b62aea6d0914aade795f262a100cc72e3c',
            email: this.USER.getUser().data.email,
            amount: this.amount * 100,
            ref: "MM_" + Math.floor(Math.random() * 10000000),
            callback: response => {
              // alert('success. transaction ref is ' + response.reference);
              console.log(response.reference);
              this.topUpWallet();
            },
            onClose: () => {
              this.showToast('Closed. No transaction was carried out');
              this.loading = false;
            }
          });
          handler.openIframe();

        }

      })

  }

  topUpWallet() {
    let walletdata = { token: this.USER.getUser().data.token, amount: this.amount };
    this.setter.submit("topup", walletdata)
      .then(r => {
        console.log(r);
        this.showToast("Successfully toped up your wallte with: ₦"+this.amount);
        this.balance = parseInt(this.amount) + parseInt(this.balance);
        this.loading = false;
        this.amount = null;
      });
  };

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: "bottom"
    });
    toast.present();
  }


}
