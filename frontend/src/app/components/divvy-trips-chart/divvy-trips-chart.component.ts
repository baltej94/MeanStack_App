import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import * as moment from 'moment'
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

import { divvyTripsCountPerDay } from '../../DivvyTripsCountPerDay';
import { PlacesService } from '../../places.service';
import { HttpClient } from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';

import { Router } from '@angular/router';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-divvy-trips-chart',
  templateUrl: './divvy-trips-chart.component.html',
  styleUrls: ['./divvy-trips-chart.component.css']
})
export class DivvyTripsChartComponent implements OnInit {
  ngOnInit() {

      }

   



}
