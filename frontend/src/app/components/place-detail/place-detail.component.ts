import { Component, OnInit ,Injectable,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

import { Station } from '../../station';
import { PlacesService } from '../../places.service';


import { Input, ViewChild, NgZone} from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { Place } from 'src/app/place';
import { HttpClient } from '@angular/common/http';

import { RealTimeLineComponent } from '../../components/real-time-line-chart/real-time-line-chart.component'
import { RealTimeSMALineComponent } from '../../components/real-time-sma-line-chart/real-time-sma-line-chart.component';


interface Location {
  lat: number;
  lng: number;
  zoom: number;
  address_level_1?:string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  label: string;
}

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.css']
})
export class PlaceDetailComponent implements OnInit {
@ViewChild('foodItem') foodItem: ElementRef;
placeSelected: Place;
hintColor;
timeLimit;
placedetails: Place[]; 
nutrition = [];
foodItemValue: any;
value;
name;
display_phone;
address1;
is_closed;
rating;
review_count;
values;
  constructor(private placesService: PlacesService, private router: Router,private _http: HttpClient,) { }
    displayedColumns = ['name'];
    // displayedColumns = ['name', 'display_phone', 'address1', 'is_closed', 'rating','review_count'];
  ngOnInit() {
  
  this.fetchplacesdetails()

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

  getInformation() {
    this.foodItemValue = this.foodItem.nativeElement.value = this.placesService.findex;
    if(this.foodItemValue !== null && this.foodItemValue != "") {
      this._http.get(' https://api.nutritionix.com/v1_1/search/' + this.foodItemValue + '?results=0:1&fields=*&appId=f6bcd969&appKey=f88a5a34494c0f78b6197774cbb5a6b2')
        .subscribe((data: any)=>{
          console.log(data);
          for (var i = 0; i < data.hits.length; i++) {
            this.nutrition[i] = {
               "calories": data.hits[i].fields.nf_calories,
               "servingWeightGrams": data.hits[i].fields.nf_serving_weight_grams,
               "protein": data.hits[i].fields.nf_protein,
            };
            console.log("The calories in "+this.foodItemValue+" is "+this.nutrition[i].calories);
            console.log("The serving weight in grams of "+this.foodItemValue+" is "+this.nutrition[i].servingWeightGrams);
          }
        });
    }
  }

}
