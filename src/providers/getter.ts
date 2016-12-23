import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular';
import 'rxjs/add/operator/map';

import { OrderRatePage } from "../pages/order-rate/order-rate";

@Injectable()
export class GetterService {

  data: any;
  meals: any;
  apiLink: string = "http://mealimeter.herokuapp.com/";
  // apiLink: string = "http://localhost/mealimeter_/index.php/";

  constructor(public http: Http, public storage: Storage, public modalCtrl: ModalController) {

  }

  load() {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.http.get('https://randomuser.me/api/?results=10')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data.results;
          resolve(this.data);
        });
    });
  }

  loadlink(extra) {
    let link = this.apiLink + "/" + extra;

    return new Promise(resolve => {
      this.http.get(link)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  checkMeals() {
    if (this.meals) {
      console.log("getting from property");
      return Promise.resolve(this.meals);
    // }else{
    //   return Promise.resolve(false);
    }
    return new Promise(resolve => {
      this.storage.get("meals")
        .then(m => {
          console.log("getting meals from storage");
          console.log(m);
          if (m) {
            this.meals = m;
            resolve(m);
          } else {
            console.log("no meals in property or storage");
            resolve(false);
          }
        });
    });
  }

  getMeals(office_id?) {
    return new Promise(resolve => {
      let link = "";

      if (office_id) {
        link = this.apiLink + 'getfoodlist?office_id=' + office_id;
      } else {
        link = this.apiLink + 'getfoodlist';
      }

      this.checkMeals()
        .then((meals) => {
          if (meals) {
            resolve(this.meals);
          } else {
            console.log("getting meals from online");
            this.http.get(link)
              .map(res => res.json())
              .subscribe(data => {
                this.meals = {
                  food: data.food,
                  drinks: data.drinks
                };
                console.log("storing meals in storage" + this.meals);
                this.storage.set("meals", this.meals);
                resolve(this.meals);
              });

          }
        });
    });
  }

  removeMeals() {
    this.storage.remove("meals")
      .then(() => {
        this.meals = null;
        this.data = null;
      })
  }

  showRateMeal(token) {
    this.loadlink("getlastorder?token=" + token)
      .then(o => {
        console.log(o);
        if (o['error'] == false) {
          let order = o['order'];
          this.modalCtrl.create(OrderRatePage, { order: order, title: "Rate your last meal" }).present();
        }
      })
  }

}
