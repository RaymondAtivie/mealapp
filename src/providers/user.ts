import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { SetterService } from "../providers/setter";
import 'rxjs/add/operator/map';


@Injectable()
export class UserService {

  details: any = false;
  balance: any = 0;
  authcode: any;

  constructor(
    public http: Http,
    public setter: SetterService,
    public storage: Storage
  ) {
    console.log('Hello User Provider');

    this.storage.get('USER').then((val) => {
      if (val) {
        this.details = val;
        this.getbalance();
      } else {
        this.details = false;
      }
    });
  }

  auth() {
    if (this.details) {
      return Promise.resolve(this.details);
    }

    return new Promise(resolve => {
      this.storage.get('USER').then((val) => {
        if (val) {
          this.details = val;
          this.getbalance();
          resolve(val);
        } else {
          this.details = false;
          resolve(false);
        }
      });
    });
  }

  getUser() {
    return this.details;
  }

  loadUser(user) {
    return new Promise(resolve => {
      this.storage.set('USER', user)
        .then(() => {
          this.details = user;
          this.balance = this.getbalance();
          resolve(user);
        });
    });
  }

  saveAuthCode(authCode) {
    this.authcode = authCode;
    this.storage.set('authcode', authCode);
  }

  getAuthCode() {
    if (this.authcode) {
      return Promise.resolve(this.authcode);
    } else {
      return new Promise(resolve => {
        this.storage.get('authcode').then((authcode) => {
          if (authcode) {
            this.authcode = authcode;
            resolve(authcode);
          } else {
            resolve(false);
          }
        });
      });
    }
  }

  getbalance() {
    if (this.balance) {
      return Promise.resolve(this.balance);
    } else {
      return new Promise(resolve => {
        this.setter.submit('getBalance', { token: this.details.data.token })
          .then(bal => {
            console.log(bal);
            this.balance = bal['balance'];
            console.log(bal['balance']);
            resolve(bal['balance']);
          });
      });
    }
  }

  loginUser(user) {
    return new Promise(resolve => {

      this.setter.submit("login", user)
        .then(res => {
          if (res['error'] == true) {
            let e = {
              error: res['error'],
              description: res['description']
            };
            resolve(e);
          } else {
            this.loadUser(res)
              .then(() => {
                let e = {
                  error: false,
                  description: "Successfully loged in",
                  payload: res
                };
                resolve(e)
              });
          }

        });

    });
  }

  destroyUser() {
    this.details = false;
    this.balance = 0;
    this.authcode = false;
    this.storage.remove('authcode');

    return new Promise(resolve => {
      this.storage.remove('USER')
        .then(() => {
          resolve(true);
        });
    });
  }

}
