import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  constructor(private http: HttpClient) { }
  ROOT_URL = 'http://localhost:5000'

  SubmitOrder(username: string, trade_type: string, price: Number, stock_code: string, quantity: string, order_type: string) {
    let rf = new FormData()
    rf.set('username',username)
    rf.set('trade_type',trade_type)
    rf.set('price',String(price))
    rf.set('stock_code',stock_code)
    rf.set('quantity',quantity)
    rf.set('order_type',order_type)
    rf.set('flavor','allornone')
    return fetch('http://localhost:5000/place_order', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'no-cors', // no-cors, *cors, same-origin
      credentials: 'same-origin', // include, *same-origin, omit
      body:rf
          // body data type must match "Content-Type" header
    });
  }

}
