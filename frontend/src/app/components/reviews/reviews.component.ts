import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';
import { UserDetails, AuthenticationService } from '../authentication.service';
import { PlacesService } from 'src/app/places.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReviewService } from 'src/app/review.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  data: any;
  details: UserDetails
  createForm: FormGroup;
  hintColor: string;
  name;
  display_phone;
  address1;
  is_closed;
  rating;
  review_count;
  
  reviewob:{
    reviews :any,
    rating :any
  }

  constructor(private placesService: PlacesService, private reviewService: ReviewService ,private fb: FormBuilder, private router: Router, private _http: HttpClient,private auth: AuthenticationService) {
    this.hintColor = "black";

    this.createForm = this.fb.group({
      reviews: '',
      rating: ''

    });
  }
  
      fetchplacesdetails()
  {
    // this.values={
    // "name":this.placesService.nameex,
    // // this.display_phone=this.placesService.phoneex,
    // // this.address1=this.placesService.addressex,
    // // this.is_closed=this.placesService.is_closedex,
    // // this.rating=this.placesService.ratingex,
    // // this.review_count=this.placesService.review_countex;
    // }
    this.name=this.placesService.nameex,
    this.display_phone=this.placesService.phoneex,
    this.address1=this.placesService.addressex,
    this.is_closed=this.placesService.is_closedex,
    this.rating=this.placesService.ratingex,
    this.review_count=this.placesService.review_countex;
  };
  WriteReview(reviews,rating,name) {
    console.log(reviews)
    console.log(rating)
    console.log(this.placesService.nameex)
    
     this.reviewService.createReview(reviews,rating,this.placesService.nameex)
   return alert("Your Review has been Submitted Sucessfuly")
     };

  ngOnInit() {
    this.fetchplacesdetails

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

