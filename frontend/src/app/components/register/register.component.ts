import { Component } from "@angular/core";
import { AuthenticationService, TokenPayload } from "../authentication.service";
import { Router } from "@angular/router";
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  templateUrl: "./register.component.html",
  styleUrls: ['./register.component.css'],
})

export class RegisterComponent {

  credentials: TokenPayload = {
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: ""
  };
  
  registerpage = new FormGroup({
    firstname: new FormControl(),
    lastname: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
    confirm_password: new FormControl()
  })
 
  constructor(private auth: AuthenticationService, private router: Router) {}

  register() {
    if(this.credentials.password != this.credentials.confirm_password ){
      console.log('this.credentials.password',this.credentials.password)
      console.log('credentials.confirm_password',this.credentials.confirm_password)
      
      window.alert("Passwords Do not Match. Please try Again.")
    }
    else if(this.credentials.first_name==='' || this.credentials.email==='' || this.credentials.password ==='' ||  this.credentials.confirm_password ==='' ){
      window.alert("Please fill the mandatory fields")


    }
    else if(this.credentials.first_name!=null && this.credentials.email!=null && this.credentials.password!=null && this.credentials.confirm_password!=null ){
      this.auth.register(this.credentials).subscribe(
        () => {
          window.alert("user registered")
          this.router.navigateByUrl("/login");
        },
        err => {
          console.error(err);
        }
      );
    }
  }
}
