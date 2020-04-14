import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, loginPayload } from '../authentication.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials: loginPayload = {
    email: '',
    password: ''
  }

    loginpage = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  })

  constructor(private auth: AuthenticationService, private router: Router) {}

  login() {
    if(this.credentials.email == '' ){
      window.alert('Please enter the Username and Password')
    }
    else{
      this.auth.login(this.credentials).subscribe(
        () => {
          return this.credentials.email,this.router.navigateByUrl('/find')
        },
        err => {
          alert('Incorrect Credentials. Please try Again')
          console.error(err)
        }
      )
    }
    }

  // printfun(){ 
  //   console.log("in this block")
  //   var usernam = (document.getElementById('user') as HTMLInputElement).value
  //   var passwor = (document.getElementById("pass") as HTMLInputElement).value
  //   window.alert(passwor);
  //   window.alert(usernam)

  }
