import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { Coordinates, CheckResponse } from 'lib';

import { Home, Loader } from 'components';
import styles from './app.module.css';

const IITW_CUSTOM_BASELINE = 'IITW_CUSTOM_BASELINE';
const IITW_LAST_UPDATED = 'IITW_LAST_UPDATED';

interface Props {
  coordinates: Coordinates;
}

const isToday = (date: string | null): boolean => {
  if (!date) return false;
  const today = new Date();
  const lastUpdatedDate = new Date(date);
  return lastUpdatedDate.getDate() === today.getDate();
};

const UserActions: React.FC<Props> = ({ coordinates }) => {
  const [hasBeenDisagreedToday, setHasBeenDisagreedToday] = useState(() =>
    isToday(localStorage.getItem(IITW_LAST_UPDATED))
  );

  const getWeatherNow = async (coords: Coordinates | null) => {
    if (!coords) return Promise.resolve();

    return fetch(
      `/api/check/now?latitude=${coords.latitude}&longitude=${coords.longitude}&customBaseLine`
    ).then((res) => res.json());
  };

  const { data } = useQuery<CheckResponse>(['checkNow', coordinates], () =>
    getWeatherNow(coordinates)
  );

  const getNewBaseline = (): string => {
    const customBaseLine = localStorage.getItem(IITW_CUSTOM_BASELINE);
    const baseline = data?.baseline || customBaseLine;
    const newBaseline = data?.isItTshirtWeather
      ? Number(baseline) + 1
      : Number(baseline) - 1;

    return newBaseline.toString();
  };

  const updateLocalStorage = (baseline: string) => {
    localStorage.setItem(IITW_CUSTOM_BASELINE, baseline);
    const timeNow = new Date().toString();
    localStorage.setItem(IITW_LAST_UPDATED, timeNow);
  };

  const updateBaseline = () => {
    const newBaseline = getNewBaseline();
    updateLocalStorage(newBaseline);
    setHasBeenDisagreedToday(true);
  };

  const handleDisagreement = () => {
    updateBaseline();
  };

  if (hasBeenDisagreedToday) return null;
  return (
    <button onClick={() => handleDisagreement()} className={styles.button}>
      I disagree
    </button>
  );
};

export default () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const onGetCurrentPosition = async (location: GeolocationPosition) => {
    const {
      coords: { latitude, longitude },
    } = location;

    setCoordinates({ latitude, longitude });
  };

  // because our app depends on localstorage
  // effectivly nothing can be rendered on the server lol
  // although we only using nextjs out of laziness anyway cos I cba to setup a server.
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onGetCurrentPosition);
  }, []);

  if (!coordinates) {
    return (
      <main className={styles.container}>
        <Loader />
      </main>
    );
  }

  const customBaseLine =
    localStorage.getItem(IITW_CUSTOM_BASELINE) || undefined;

  return (
    <main className={styles.container}>
      <Home customBaseLine={customBaseLine} coordinates={coordinates} />
      <UserActions coordinates={coordinates} />
    </main>
  );
};
