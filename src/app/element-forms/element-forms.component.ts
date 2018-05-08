import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import { NgModel } from '@angular/forms';
import { ElementFormsService } from './element-forms.service';
import { WeatherService } from '../weatherApi/weather.service';

@Component({
  selector: 'app-element-forms',
  templateUrl: './element-forms.component.html',
  styleUrls: ['./element-forms.component.css']
})
export class ElementFormsComponent{

  iconUrl:string;
  maxTemp:string;
  minTemp:string;
  humidity: string;
  wind:string;
  dataWeatherName:string;
  dataWeather= [];
  
  
  constructor(public _ElementFormsService: ElementFormsService, public _WeatherService : WeatherService){}
  
  
  sendPositionInputs(form: NgForm){
    console.log(form.value);
    this._WeatherService.getWeatherCurrent(form.value)
    .subscribe(
      res=>{
        this.dataWeather = res;
        this.dataWeatherName = res.name; 
        this.iconUrl = res.weather[0].icon;
        this.maxTemp = res.main.temp_max;
        this.minTemp = res.main.temp_min;
        this.humidity = res.main.humidity;
        this.wind = res.wind.speed;
        this.dataWeather= [];
      },
      err => console.error(err)
    )
  };


  getLocation() {
      if (navigator.geolocation) {
        var self = this;
        navigator.geolocation.getCurrentPosition(function(position){

          self._WeatherService.getYourPosition(position.coords.latitude,position.coords.longitude)
          .subscribe(
            res=>{
              self.dataWeather = res;
              self.dataWeatherName = res.name; 
              self.iconUrl = res.weather[0].icon;
              self.maxTemp = res.main.temp_max;
              self.minTemp = res.main.temp_min;
              self.humidity = res.main.humidity;
              self.wind = res.wind.speed;
              self.dataWeather= [];
            },
            err => console.error(err)
          )
        });
      }
  };


  
};
