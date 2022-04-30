import { WeatherResponse, LOWEST_FEELS_LIKE } from 'lib';

export const calculateIfTShirtWeather = (weather: WeatherResponse): boolean => {
  // "feels like" takes into account wind chill and humidity
  // https://blog.metoffice.gov.uk/2012/02/15/what-is-feels-like-temperature/
  if (weather.main.feels_like >= LOWEST_FEELS_LIKE) {
    return true;
  }

  return false;
};
