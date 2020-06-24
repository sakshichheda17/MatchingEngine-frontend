import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { WebRequestService } from '../web-request.service';
import { element } from 'protractor';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private WebRequest: WebRequestService) { }
  username
  modal
  //API='DI2J7IQDDRDE4IMN'
  Symbols = ["BHARTIARTL.NS",
    "TCS.NS",
    "HDFCBANK.NS",
    "SBIN.NS",
    "INFY.NS"]
  Prices = {
    'BHARTIARTL.NS': { Name: 'BHARTI AIRTEL', Value: 0 },
    'TCS.NS': { Name: 'TATA CONSULTANCY', Value: 0 },
    'HDFCBANK.NS': { Name: 'HDFC BANK', Value: 0 },
    'SBIN.NS': { Name: 'SBI', Value: 0 },
    'INFY.NS': { Name: 'INFOSYS', Value: 0 },
  }

  //For placing Order
  CurrentStock//Stock code
  OrderType = 'market'
  TradeType
  Quantity
  Price
  flavor = "allornone"
  Editing=false
  EditingOrderid
  //USER HISTORY  
  UserHistory
  ngOnInit(): void {
    this.route.queryParams.subscribe((res) => {
      this.username = res.name
    })

    this.getStockData();
    this.GetUserHistory();
  }

  getStockData() {
    let url = 'http://localhost:5000/getPrice'
    this.http.get(url).subscribe((res: any) => {

      Object.keys(res).forEach(element => {
        this.Prices[element].Value = res[element]
      });
    })
    setInterval(() => {
      this.http.get(url).subscribe((res: any) => {
        //console.log(res)
        Object.keys(res).forEach(element => {
          this.Prices[element].Value = res[element]
        });

      })

    }, 2000)

  }

  ShowModal(event, Order) {
    this.Editing=false
    this.TradeType = Order
    this.CurrentStock = this.Prices[event.target.id]
    this.CurrentStock.key = event.target.id
    this.Price = this.CurrentStock.Value
    console.log(this.CurrentStock)
    this.modal = document.getElementById("myModal");
    this.modal.style.display = "block";

  }

  CloseModal() {
    this.modal.style.display = "none";
  }
  logOut() {
    this.router.navigate(['/']);
  }

  async SubmitOrder() {
    if(!this.Editing){
    let rf = new FormData()
    rf.set('username', this.username)
    rf.set('trade_type', this.TradeType)
    rf.set('price', this.Price)
    rf.set('stock_code', this.CurrentStock.key)
    rf.set('quantity', this.Quantity)
    rf.set('order_type', this.OrderType)
    rf.set('flavor', this.flavor)

    fetch('http://localhost:5000/place_order', { body: rf, method: "POST" }).then(res => {
      console.log(res.text())
    })
  }
  else{
    let url = 'http://localhost:5000/edit'
    let rf = new FormData()
    let id=this.EditingOrderid
    rf.set('order_id', id)
    rf.set('price', this.Price)
    rf.set('quantity', this.Quantity)
    rf.set('flavor', this.flavor)
    let res = await fetch(url, { body: rf, method: "POST" })
  }
    this.CloseModal()
  }

  async GetUserHistory() {
    let url = 'http://localhost:5000/history'
    let rf = new FormData()
    rf.set('username', this.username)
    let res = await fetch(url, { body: rf, method: "POST" })
    let data = await (res.text())
    console.log(data)
    this.UserHistory = JSON.parse(data)

    setInterval(async () => {
      let res = await fetch(url, { body: rf, method: "POST" })
      let data = await (res.text())
      this.UserHistory = JSON.parse(data)
      console.log(this.UserHistory)
    }, 2000)
  }

  async Delete(event) {
    let id = event.target.id
    let url = 'http://localhost:5000/remove'
    let rf = new FormData()
    rf.set('order_id', id)
    let res = await fetch(url, { body: rf, method: "POST" })
    let data = await (res.text())
    alert('Deleted Successfully')
  }


  async EditOrder(event){
    this.Editing=true
    let i = Number(event.target.id)
    this.EditingOrderid=i
    let id = this.UserHistory.queued.findIndex(x => x.order_id === Number(i));
    console.log(this.UserHistory.queued)
    this.OrderType=this.UserHistory.queued[id].order_type
    this.TradeType=this.UserHistory.queued[id].trade_type
    this.Quantity=this.UserHistory.queued[id].quantity
    this.Price= this.UserHistory.queued[id].price
    this.CurrentStock = this.Prices[this.UserHistory.queued[id].stock_code]
    this.CurrentStock.key =  this.UserHistory.queued[id].stock_code
    //this.CurrentStock.key =
    this.flavor = this.UserHistory.queued[id].flavor
    this.modal = document.getElementById("myModal");
    this.modal.style.display = "block";



  }
}

