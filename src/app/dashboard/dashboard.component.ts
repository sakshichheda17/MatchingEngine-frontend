import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private route:ActivatedRoute,private http:HttpClient,private router: Router) { }
  username
  modal
  //API='DI2J7IQDDRDE4IMN'
  Symbols=['SBICARD.BSE','TTML.BSE','IPCALAB.BSE','DMART.BSE']
  Prices={
    'SBICARD.BSE':{Name:'SBI CARDS',Value:0},
    'TTML.BSE':{Name:'TATA MOTORS',Value:0},
    'IPCALAB.BSE':{Name:'IPCA LAB',Value:0},
    'DMART.BSE':{Name:'DMART',Value:0},
  }

  //For placing Order
  CurrentStock
  OrderType=''
  TradeType
  Quantity
  ngOnInit(): void {
    this.route.queryParams.subscribe((res)=>{
      this.username=res.name
    })

    this.getStockData();
  }

  getStockData(){
    let dateTime = new Date()
    this.Symbols.forEach(sym => {
    let url=`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${sym}&interval=1min&apikey=DI2J7IQDDRDE4IMN`
    this.http.get(url).subscribe((res:any)=>{
      console.log(res)
      let Obj=res["Time Series (1min)"]
      let latestPrice=Obj[Object.keys(Obj)[0]]
      this.Prices[sym].Value=latestPrice["1. open"]
   
    })
  });
  
  } 

  ShowModal(event,Order){
    this.TradeType=Order
    this.CurrentStock=this.Prices[event.target.id]
    this.CurrentStock.key=event.target.id
    console.log(this.CurrentStock)
      this.modal= document.getElementById("myModal");
      this.modal.style.display = "block";
      
  } 

  CloseModal() {
    this.modal.style.display = "none";
  }
  logOut(){
    this.router.navigate(['/']);
  }
}
