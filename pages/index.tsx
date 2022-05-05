import { useState, useEffect } from 'react';

import { Home, Loader } from 'components';
import { Coordinates } from 'lib';
import styles from './app.module.css';

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

  return (
    <main className={styles.container}>
      <Home coordinates={coordinates} />
    </main>
  );
};
