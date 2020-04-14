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
import { Review } from 'src/app/Review';


@Component({
  selector: 'app-get-user-reviews',
  templateUrl: './get-user-reviews.component.html',
  styleUrls: ['./get-user-reviews.component.css']
})
export class GetUserReviewsComponent implements OnInit {
  details: UserDetails

  reviews: Review[]=[];
  displayedColumns = ['Restaurant Name','Reviews','Rating'];
  constructor(private placesService: PlacesService, private reviewService: ReviewService ,private fb: FormBuilder, private router: Router, private _http: HttpClient,private auth: AuthenticationService) {
     }
     getReviews() {
      // console.log(reviews)
      // console.log(rating)
      this.reviewService.getReviews().subscribe((data: Review[]) => {
        this.reviews = data;
        if(data.length===0){
          alert("No Reviews Given by user : "+ this.details.first_name);
        }
        for (var i = 0; i < this.reviews.length; i++) {
          this.reviews[i] = {
             "reviews": data[i].reviews,
             "rating": data[i].rating,
             "restaurant_name":data[i].restaurant_name
             }
       
            }
            console.log(this.reviews)
          }
      );
       //console.log(data)
     
    };
  

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
