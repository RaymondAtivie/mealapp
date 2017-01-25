import { Component } from '@angular/core';
import { NavController, ViewController, ToastController, NavParams } from 'ionic-angular';

import { GetterService } from "../../providers/getter";
import { SetterService } from "../../providers/setter";
import { UserService } from "../../providers/user";

@Component({
  selector: 'page-invitecontact',
  templateUrl: 'invitecontact.html'
})
export class InvitecontactPage {

  contacts: any = [];
  ccs: any = [];
  feedback: any = [];
  maxNum: number = 2;
  countIV:number = 0;
  loading:any = true;
  showClose:boolean = false;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public getter: GetterService,
    public setter: SetterService,
    public USER: UserService,
    public navParams: NavParams
  ) {

    this.getter.loadlink("order/getColleagues?token=" + this.USER.getUser().data.token)
      .then(result => {
        this.loading = false;
        console.log(result);
        if (result['error'] == false) {
          this.contacts = result['result'];
        }
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvitecontactPage');
  }

  checkUser(user_id, ev) {
    user_id = Number.parseInt(user_id);

    let maxNum = this.maxNum - this.USER.inviteNum;

    if (ev.checked) {
      if (this.ccs.length >= maxNum) {
        ev.checked = false;
        this.showToast("Maximum of " + this.maxNum + " colleagues allowed");
        console.log(ev);
        return false;
      } else {
        this.ccs.push(user_id);
      }
    } else {

      if (this.checkContains(user_id)) {
        var index = this.ccs.indexOf(user_id);
        if (index > -1) {
          this.ccs.splice(index, 1);
        }
      }
    }

    console.log(this.ccs);
  }

  dismiss() {
    this.viewCtrl.dismiss()
  }

  checkContains(user_id) {
    return this.ccs.indexOf(user_id) > -1;
  }

  getInviteStatus(invite_id) {

    if (this.feedback[invite_id]) {
      return this.feedback[invite_id];
    }
    return false;
  }

  sendInvites() {
    this.ccs.forEach(invite => {
      console.log("Sending for - " + invite);
      this.feedback[invite] = 'sending';
      console.log(this.feedback);
      this.sendInvite(invite);
    });
  }

  sendInvite(invite_id) {
    this.setter.submit("order/sendInvite", {
      token: this.USER.getUser().data.token,
      office_id: this.USER.getUser().officedata.office_id,
      invite_id: invite_id
    })
      .then((result) => {
        if (result['error'] == false) {
          if (result['result'] == true) {
            this.feedback[invite_id] = 'sent';
            this.USER.inviteNum++;
          } else {
            this.feedback[invite_id] = 'already';
          }

          this.showClose = true;

          //remove from next send
          var index = this.ccs.indexOf(invite_id);
          if (index > -1) {
            this.ccs.splice(index, 1);
          }
        } else {
          this.feedback[invite_id] = 'wrong';
        }
        console.log("Sent to " + invite_id);
        console.log(this.feedback);
      })
  }

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3500,
      position: "bottom"
    });
    toast.present();
  }

}
