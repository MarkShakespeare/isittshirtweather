import type { NextApiRequest, NextApiResponse } from 'next';

import {
  WeatherResponse,
  CheckResponse,
  OPEN_WEATHER_MAP_API_KEY,
  OPEN_WEATHER_MAP_API_URL,
  calculateIfTShirtWeather,
} from 'lib';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckResponse>
) {
  const { latitude, longitude } = req.query;
  const requestUrl = `${OPEN_WEATHER_MAP_API_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric`;

  const response = await fetch(requestUrl);
  const weatherResponse: WeatherResponse = await response.json();

  const isItTshirtWeather = calculateIfTShirtWeather(weatherResponse);

  res.status(200).json({ isItTshirtWeather });
}
