import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './components/authentication.service'



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router, public auth: AuthenticationService) { }

  title = 'ChicagoSocialHub-app';
  registerView;

  callHomePage(){ 
    console.log("called find");
    this.registerView="regView2";
    this.router.navigate(['/login']);
    //this.router.navigate(['/home']);
  }
}
