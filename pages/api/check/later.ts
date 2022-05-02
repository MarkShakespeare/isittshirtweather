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

const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() === today.getDate();
};

const DEFAULT_LOCALE = 'en-GB';

const formatHour = (hour: WeatherHourly, userLocale: string) =>
  new Date(hour.dt * 1000).toLocaleTimeString(userLocale, {
    hour: '2-digit',
    minute: '2-digit',
  });

const filterTodayHours = (hours: WeatherHourly[]): WeatherHourly[] => {
  const todayHours = [];

  // the weather returns multiple days of hours but we only want todays
  for (let [, hour] of hours.entries()) {
    if (!isToday(new Date(hour.dt * 1000))) {
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

  // get user preferred locale
  const requestLocales = req.headers['accept-language']?.split(',');
  const userLocale = requestLocales ? requestLocales[0] : DEFAULT_LOCALE;

  const requestUrl = `${OPEN_WEATHER_MAP_API_URL}/onecall?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&exclude=current,minutely,daily,alerts`;

  const response = await fetch(requestUrl);
  const weatherResponse: WeatherHourlyResponse = await response.json();

  const todayHours = filterTodayHours(weatherResponse.hourly);

  const firstTShirtWeather = getFirstTShirtWeatherHour(todayHours);

  if (firstTShirtWeather) {
    const formattedFirstTShirtWeather = formatHour(
      firstTShirtWeather,
      userLocale
    );

    return res.status(200).json({
      isItTshirtWeatherLater: true,
      tShirtWeatherLaterTime: formattedFirstTShirtWeather,
    });
  }

  res.status(200).json({
    isItTshirtWeatherLater: false,
  });
}
