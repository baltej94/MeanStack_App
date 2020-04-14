////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


/// This file and the source code provided can be used only for
/// the projects and assignments of this course

/// Last Edit by Dr. Atef Bader: 1/30/2019


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HttpHeaders } from '@angular/common/http';



import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


import { Place } from './place';
import { Station } from './station';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};


@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  uri = 'http://localhost:4000';
  Emmiter;
  time_interval;
  stationNameSelected = 'None';
  findex;
  whereex;
  nameex;
  addressex;
  phoneex;
  is_closedex;
  ratingex;
  review_countex;

  
  constructor(private http: HttpClient) {


  }


  getPlaces() : Observable<Place[]> {
    return this.http.get<Place[]>(`${this.uri}/places`);
  }


  getPlaceSelected() {
    return this.http.get(`${this.uri}/place_selected`);
  }

  getStationSelected() {
    return this.http.get(`${this.uri}/station_selected`);
  }


  getStations() {
    return this.http.get(`${this.uri}/stations`);
  }



  findPlaces(find, where) {
    const find_places_at = {
      find: find,
      where: where,
    };
    this.findex= find,
    this.whereex=where,
    console.log(this.findex),
    console.log(this.whereex);
    return this.http.post(`${this.uri}/places/find`, find_places_at, httpOptions);
  }

  findStations(placeName) {
    const find_stations_at = {
      placeName: placeName
    };
  var str = JSON.stringify(find_stations_at, null, 2);
    return this.http.post(`${this.uri}/stations/find`, find_stations_at, httpOptions);
  }
placename:any;
  findPlacedetail(name,phone,address1,is_closed,rating,review_count) {
    //this.placename=placeName
    //console.log(name,phone,address1,is_closed,rating,review_count)
    this.nameex= name,
    this.addressex=address1;
    this.phoneex=phone;
    this.is_closedex=is_closed;
    this.ratingex=rating;
    this.review_countex=review_count;
    console.log( this.nameex,this.addressex,this.phoneex,this.is_closedex,this.ratingex,this.review_countex)
    var str = JSON.stringify(this.placename, null, 2);
    //console.log(this.whereex)
     this.http.post(`${this.uri}/places/detaill`,this.placename, httpOptions);
  }
  
  }
 
 
 
 

