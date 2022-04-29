import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { CheckResponse } from './api/check';
import { Loader } from 'components';
import styles from './index.module.css';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export const Home = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const doCheck = async (coords: Coordinates | null) => {
    if (!coords) return Promise.resolve();

    return fetch(
      `/api/check?latitude=${coords.latitude}&longitude=${coords.longitude}`
    ).then((res) => res.json());
  };

  const { isLoading, data } = useQuery<CheckResponse, any>(
    ['check', coordinates],
    () => doCheck(coordinates)
  );

  const checkWeather = async (location: GeolocationPosition) => {
    const {
      coords: { latitude, longitude },
    } = location;

    setCoordinates({ latitude, longitude });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(checkWeather);
  }, []);

  if (isLoading || !data) {
    return (
      <main className={styles.container}>
        <Loader />
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <h1>{data?.isItTshirtWeather ? <>YES</> : <>NO</>}</h1>
    </main>
  );
};
