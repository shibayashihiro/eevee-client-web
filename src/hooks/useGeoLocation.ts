import { useEffect, useState, useMemo } from 'react';

type LatLng = {
  latitude: number;
  longitude: number;
};

type UseGeolocationResult = {
  currentPosition: LatLng | null;
  loaded: boolean;
  error: Error | null;
};

export const useGeolocation = (): UseGeolocationResult => {
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError(new Error('お使いの端末またはブラウザでは、位置情報を利用できません。'));
      setLoaded(true);
      return;
    }
    const onSucess = (position: GeolocationPosition) => {
      setCurrentPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setLoaded(true);
    };
    const onError = (error: GeolocationPositionError) => {
      let errorMessage = '予期せぬエラーが発生しました。';
      switch (error.code) {
        case GeolocationPositionError.PERMISSION_DENIED:
          errorMessage = '位置情報の取得が許可されていません。';
          break;
        case GeolocationPositionError.POSITION_UNAVAILABLE:
          errorMessage = '位置情報の取得に失敗しました。';
          break;
        case GeolocationPositionError.TIMEOUT:
          errorMessage = '制限時間内に位置情報を取得できませんでした。';
          break;
      }
      setError(new Error(errorMessage));
      setLoaded(true);
    };
    navigator.geolocation.getCurrentPosition(onSucess, onError);
  }, []);

  return useMemo(() => {
    return {
      currentPosition,
      loaded,
      error,
    };
  }, [currentPosition, loaded, error]);
};
