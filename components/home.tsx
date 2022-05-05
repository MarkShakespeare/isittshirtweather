import React from 'react';
import { useQuery } from 'react-query';

import { CheckResponse, CheckLaterResponse, Coordinates } from 'lib';
import { Loader } from 'components';
import styles from './home.module.css';

interface Props {
  coordinates: Coordinates;
  customBaseLine?: string;
}

export const Home: React.FC<Props> = ({ customBaseLine, coordinates }) => {
  const getWeatherNow = async (coords: Coordinates | null) => {
    if (!coords) return Promise.resolve();

    return fetch(
      `/api/check/now?latitude=${coords.latitude}&longitude=${coords.longitude}&customBaseLine=${customBaseLine}`
    ).then((res) => res.json());
  };

  const getWeatherLater = async (
    coords: Coordinates | null,
    nowResponse: CheckResponse | undefined
  ) => {
    if (!coords) return Promise.resolve();
    if (!nowResponse) return Promise.resolve();
    if (nowResponse.isItTshirtWeather) return Promise.resolve();

    return fetch(
      `/api/check/later?latitude=${coords.latitude}&longitude=${coords.longitude}&customBaseLine=${customBaseLine}`
    ).then((res) => res.json());
  };

  const { isLoading: isCheckNowLoading, data: nowResponse } = useQuery<
    CheckResponse,
    any
  >(['checkNow', coordinates], () => getWeatherNow(coordinates));

  const { isLoading: isCheckLaterLoading, data: laterResponse } = useQuery<
    CheckLaterResponse,
    any
  >(['checkLater', nowResponse], () =>
    getWeatherLater(coordinates, nowResponse)
  );

  if (isCheckNowLoading || isCheckLaterLoading || !nowResponse) {
    return <Loader />;
  }

  return (
    <>
      <h1>{nowResponse?.isItTshirtWeather ? <>YES</> : <>NO</>}</h1>

      {laterResponse?.isItTshirtWeatherLater && (
        <h2 className={styles.description}>
          It will be T-shirt weather at {laterResponse?.tShirtWeatherLaterTime}
        </h2>
      )}
    </>
  );
};
