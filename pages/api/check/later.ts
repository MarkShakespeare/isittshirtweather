import type { NextApiRequest, NextApiResponse } from 'next';

import {
  CheckLaterResponse,
  OPEN_WEATHER_MAP_API_KEY,
  OPEN_WEATHER_MAP_API_URL,
  LOWEST_FEELS_LIKE,
} from 'lib';

interface WeatherHourly {
  dt: number; // datetime
  feels_like: number;
}

interface WeatherHourlyResponse {
  hourly: WeatherHourly[];
}

const getFirstTShirtWeatherHour = (
  hours: WeatherHourly[]
): WeatherHourly | undefined => {
  // first hour is current one (so sometimes in the past)
  const [, ...rest] = hours;
  return rest.find((hour) => hour.feels_like > LOWEST_FEELS_LIKE);
};

const LOCALE = 'en-UK';
const FINAL_HOUR_OF_DAY = '23:00';

const formatHour = (hour: WeatherHourly) =>
  new Date(hour.dt * 1000).toLocaleTimeString(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
  });

const filterTodayHours = (hours: WeatherHourly[]): WeatherHourly[] => {
  const todayHours = [];

  // the weather returns multiple days of hours but we only want todays
  for (let [, hour] of hours.entries()) {
    const formattedHour = formatHour(hour);
    if (formattedHour === FINAL_HOUR_OF_DAY) {
      todayHours.push(hour);
      break;
    }

    todayHours.push(hour);
  }

  return todayHours;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckLaterResponse>
) {
  const { latitude, longitude } = req.query;
  const requestUrl = `${OPEN_WEATHER_MAP_API_URL}/onecall?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&exclude=current,minutely,daily,alerts`;

  const response = await fetch(requestUrl);
  const weatherResponse: WeatherHourlyResponse = await response.json();

  const todayHours = filterTodayHours(weatherResponse.hourly);
  const firstTShirtWeather = getFirstTShirtWeatherHour(todayHours);

  if (firstTShirtWeather) {
    const formattedFirstTShirtWeather = formatHour(firstTShirtWeather);

    return res.status(200).json({
      isItTshirtWeatherLater: true,
      tShirtWeatherLaterTime: formattedFirstTShirtWeather,
    });
  }

  res.status(200).json({
    isItTshirtWeatherLater: false,
  });
}
