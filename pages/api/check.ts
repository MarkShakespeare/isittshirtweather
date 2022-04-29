import type { NextApiRequest, NextApiResponse } from 'next';

const openWeatherMapApiKey = process.env.OPEN_WEATHER_MAP_API_KEY;
const openWeatherMapApiUrl = process.env.OPEN_WEATHER_MAP_API_URL;

const LOWEST_FEELS_LIKE = 19;

export interface CheckResponse {
  isItTshirtWeather: boolean;
}

interface MainWeather {
  temp: number;
  feels_like: number; // only using this for now - future iterations with tips will also use cloud/sun/rain etc.
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

interface WeatherResponse {
  main: MainWeather;
}

const calculateIfTShirtWeather = (weather: WeatherResponse): boolean => {
  // "feels like" takes into account wind chill and humidity
  // https://blog.metoffice.gov.uk/2012/02/15/what-is-feels-like-temperature/
  if (weather.main.feels_like >= LOWEST_FEELS_LIKE) {
    return true;
  }

  return false;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckResponse>
) {
  const { latitude, longitude } = req.query;
  const requestUrl = `${openWeatherMapApiUrl}?lat=${latitude}&lon=${longitude}&appid=${openWeatherMapApiKey}&units=metric`;

  const response = await fetch(requestUrl);
  const weatherResponse: WeatherResponse = await response.json();

  const isItTshirtWeather = calculateIfTShirtWeather(weatherResponse);

  res.status(200).json({ isItTshirtWeather });
}
