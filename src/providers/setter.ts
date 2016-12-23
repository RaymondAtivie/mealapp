import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SetterService {
  data: any = {};
  authdata: any;
  apiLink: string = "http://mealimeter.herokuapp.com/";
  // apiLink: string = "http://localhost/mealimeter_/index.php/";

  constructor(public http: Http) {
    console.log('Hello Setter Provider');
  }

  submit(sendlink, senddata) {
    var link = this.apiLink + sendlink;
    var sdata = this.formData(senddata);

    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({
      headers: headers
    });

    return new Promise(resolve => {
      this.http.post(link, sdata, options)
        .subscribe(data => {
          this.data.response = data['_body'];
          resolve(JSON.parse(data['_body']));
        }, error => {
          resolve("oops");
        });
    });
  }

  getAuthCode(ref) {
    var link = "https://api.paystack.co/transaction/verify/" + ref;

    console.log(link);

    let headers = new Headers({
      'Authorization': 'Bearer sk_live_292afa571819297a16bc5352840419a3704e1c62'
    });
    let options = new RequestOptions({
      headers: headers
    });

    return new Promise(resolve => {
      this.http.get(link, options)
        .subscribe(data => {
          this.authdata = data['_body'];
          console.log(this.authdata);
          resolve(JSON.parse(data['_body']));
        }, error => {
          resolve("oops");
        });
    });
  }

  chargeReturning(email, amount, authcode) {
    var link = "https://api.paystack.co/transaction/charge_authorization/";

    console.log(link);
    var postdata = {email: email, amount: amount, authorization_code: authcode};

    let headers = new Headers({
      'Authorization': 'Bearer sk_live_292afa571819297a16bc5352840419a3704e1c62',
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });

    return new Promise(resolve => {
      this.http.post(link, postdata, options)
        .subscribe(data => {
          this.authdata = data['_body'];
          console.log(this.authdata);
          resolve(JSON.parse(this.authdata));
        }, error => {
          resolve({error:'error'});
        });
    });
  }

  formData(myFormData) {
    return Object.keys(myFormData).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(myFormData[key]);
    }).join('&');
  }

}
