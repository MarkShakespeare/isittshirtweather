import type { NextApiRequest, NextApiResponse } from 'next';

import {
  WeatherResponse,
  CheckResponse,
  OPEN_WEATHER_MAP_API_KEY,
  OPEN_WEATHER_MAP_API_URL,
  LOWEST_FEELS_LIKE,
} from 'lib';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckResponse>
) {
  const { latitude, longitude, customBaseLine } = req.query;
  const requestUrl = `${OPEN_WEATHER_MAP_API_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric`;

  const response = await fetch(requestUrl);
  const weatherResponse: WeatherResponse = await response.json();

  const baseline = Number(customBaseLine) || LOWEST_FEELS_LIKE;

  const isItTshirtWeather = weatherResponse.main.feels_like >= baseline;

  res.status(200).json({ isItTshirtWeather, baseline });
}
