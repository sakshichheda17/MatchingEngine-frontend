import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username : string;
  password : string;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(){
    if ( this.username == "user1" && this.password == '1234'){
      console.log("success");
      this.router.navigate(['dashboard'],{queryParams:{name:this.username}});
    }
    else if ( this.username == "user2" && this.password == '5678'){
      console.log("success");
      this.router.navigate(['dashboard'],{queryParams:{name:this.username}});
    }
    else{
      alert("Invalid credentials");
    }
  }
}
