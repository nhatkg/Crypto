import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Crypto } from './Crypto';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _http:HttpClient) { }

  getData():Observable<Crypto>{
    let apiUrl = " https://api2.binance.com/api/v3/ticker/24hr"
    return this._http.get<Crypto>(apiUrl)
  }
}
