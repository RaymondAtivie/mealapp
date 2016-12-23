import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';

import { GetterService } from '../../providers/getter';
import { UserService } from '../../providers/user';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  backclass: any = "back1";
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController
    ) { }

  ionViewDidLoad() {
    this.menuCtrl.swipeEnable(false);
    setInterval(()=>{
      if(this.backclass == "back1"){
        this.backclass = "back2";
      }else{
        this.backclass = "back1";
      }
    }, 5000);
  }

  gotoLogin(){
    this.navCtrl.push(LoginPage);
  }
  gotoSignup(){
    this.navCtrl.push(SignupPage);
  }

}
