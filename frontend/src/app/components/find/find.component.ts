////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


/// This file and the source code provided can be used only for
/// the projects and assignments of this course

/// Last Edit by Dr. Atef Bader: 1/30/2019


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////



import { Component, OnInit ,ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { HttpClient } from '@angular/common/http';
// import { UserDetails } from '../authentication.service';
import { AuthenticationService, UserDetails, loginPayload } from '../authentication.service'

declare const responsiveVoice: any;




@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.css']
})
export class FindComponent implements OnInit {
  @ViewChild('foodItem') foodItem: ElementRef;
  createForm: FormGroup;
  hintColor;
  timeLimit;
  nutrition = [];
  foodItemValue: any;
  details: UserDetails
  credentials: loginPayload = {
    email: '',
    password: ''
  }

  
  constructor(private placesService: PlacesService, private fb: FormBuilder, private router: Router, private _http: HttpClient,private auth: AuthenticationService) {
    this.hintColor = "black";

    this.createForm = this.fb.group({
      where: '',
      find: ''

    });
  }
  

  findPlaces(find, where) {


    this.placesService.findPlaces(find, where).subscribe(() => {

      this.router.navigate(['/list_of_places']);

    });
    
  }


  ngOnInit() {

    const user = this.auth.getUserDetails()
    if (user) {
      this.details=user
      // console.log(this.details)
      // console.log(this.details.first_name)
      // console.log(user.first_name)
      return user.exp > Date.now() / 1000
    }
  }

}
