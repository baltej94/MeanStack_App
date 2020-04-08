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

  
  constructor(private placesService: PlacesService, private fb: FormBuilder, private router: Router, private _http: HttpClient) {
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
  }
  getInformation() {
    this.foodItemValue = this.foodItem.nativeElement.value;
    if(this.foodItemValue !== null && this.foodItemValue != "") {
      this._http.get(' https://api.nutritionix.com/v1_1/search/' + this.foodItemValue + '?results=0:1&fields=*&appId=f6bcd969&appKey=f88a5a34494c0f78b6197774cbb5a6b2')
        .subscribe((data: any)=>{
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
