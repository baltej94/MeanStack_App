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
    if(this.credentials.password != this.credentials.confirm_password){
      window.alert("different passwords")
    }
    else{
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
