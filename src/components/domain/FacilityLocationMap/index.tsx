import { useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { GoogleMap } from '@react-google-maps/api';
import { FC } from 'react';

type Props = {
  location: LatLng;
};

type LatLng = {
  lat: number;
  lng: number;
};

export const FacilityLocationMap: FC<Props> = ({ location }) => {
  const { isLoaded, onLoad } = useGoogleMap(location);

  return (
    <>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '200px',
          }}
          options={{
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
          }}
          zoom={18}
          onLoad={onLoad}
        >
          <MarkerF position={location} />
        </GoogleMap>
      )}
    </>
  );
};

const useGoogleMap = (location: LatLng) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const onLoad = (map: google.maps.Map) => {
    map.setCenter(location);
  };

  return { isLoaded, onLoad };
};
