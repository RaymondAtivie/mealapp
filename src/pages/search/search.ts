import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FoodPage } from '../food/food';

import { GetterService } from "../../providers/getter";

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  @ViewChild('searchInput') mySearchBar ;

  meals: any = [];
  searchTerm: string;

  constructor(
    public navCtrl: NavController,
    public getter: GetterService
  ) {

    this.initializeFoods();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
    console.log(this.mySearchBar);
    this.mySearchBar.setFocus();
  }

  getStarColor(rating, itemnum) {
    if (itemnum <= rating) {
      return 'mealgreen';
    }
    return 'light';
  }

  search(ev: any) {
    this.initializeFoods();

    let val = ev.target.value;
    this.searchTerm = val;

    if (val) {

      let cname, cmain, cingredients, cvendor, if1, if2, if3, if4;
      this.meals = this.meals.filter((food) => {
        console.log(food);
        cname = food.name;
        cmain = food.main;
        cvendor = food.vendor.name;
        if (food.ingredients) {
          cingredients = food.ingredients;
        }

        if1 = cname.toLowerCase().indexOf(val.toLowerCase()) > -1;
        if2 = cmain.toLowerCase().indexOf(val.toLowerCase()) > -1;
        if (food.ingredients) {
          if3 = cingredients.toLowerCase().indexOf(val.toLowerCase()) > -1;
        } else {
          if3 = false;
        }
        if4 = cvendor.toLowerCase().indexOf(val.toLowerCase()) > -1;

        return if1 || if2 || if3 || if4;
      });
    }
  }

  initializeFoods() {
    this.meals = this.getter.storeAllMeals();
    console.log(this.meals);
  }

  gotoFood(food) {
    this.navCtrl.push(FoodPage, {
      food: food
    });
  }

}
