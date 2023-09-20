import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const API_URL = environment.API_URL;
const API_KEY = environment.API_KEY;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  weatherTemp: WeatherResponse | null = null;
  city: string = 'Manado';
  currentDate: string = ''; 

  constructor(private httpClient: HttpClient) {
    this.setCurrentDate();
    this.searchWeather();
  }

  setCurrentDate() {
    const currentDate = new Date();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const day = currentDate.getDate();
    const month = months[currentDate.getMonth()];

    this.currentDate = `${dayOfWeek}, ${day} ${month}`;
  }

  
  getWeatherIcon(weatherMain: string): string {
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return 'sunny';
      case 'clouds':
        return 'cloudy';
      case 'rain':
        return 'rainy';
      // Tambahkan pemetaan ikon untuk jenis cuaca lainnya sesuai kebutuhan Anda
      default:
        return 'partly-sunny';
    }
  }


  searchWeather() {
    if (this.city) {
      this.httpClient
        .get<WeatherResponse>(`${API_URL}weather?q=${this.city}&appid=${API_KEY}`)
        .subscribe(
          (results) => {
            console.log(results);
            this.weatherTemp = results;
            
            // Convert temperatures from Kelvin to Celsius
            this.weatherTemp.main.temp = this.convertKelvinToCelsius(this.weatherTemp.main.temp);
            this.weatherTemp.main.feels_like = this.convertKelvinToCelsius(this.weatherTemp.main.feels_like);
            this.weatherTemp.main.temp_min = this.convertKelvinToCelsius(this.weatherTemp.main.temp_min);
            this.weatherTemp.main.temp_max = this.convertKelvinToCelsius(this.weatherTemp.main.temp_max);
          },
          (error) => {
            console.error(error);
          }
        );
    }
  }

  convertKelvinToCelsius(kelvin: number): number {
    return kelvin - 273.15;
  }
}

interface WeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  name: string;
  weather: {
    main: string;
  }[];
  
}
