export interface CheckResponse {
  isItTshirtWeather: boolean;
}

export interface CheckLaterResponse {
  isItTshirtWeatherLater: boolean;
  tShirtWeatherLaterTime?: string;
}

export interface MainWeather {
  temp: number;
  feels_like: number; // only using this for now - future iterations with tips will also use cloud/sun/rain etc.
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WeatherResponse {
  main: MainWeather;
}
