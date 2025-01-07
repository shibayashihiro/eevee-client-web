import { useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { GoogleMap } from '@react-google-maps/api';
import { FC, useState } from 'react';

type Props = {
  coordinates: LatLng;
  onMapClick: (lat: number, lng: number) => void;
};

type LatLng = {
  lat: number;
  lng: number;
};

export const DeliveryAddressMap: FC<Props> = ({ coordinates, onMapClick }) => {
  const { isLoaded, onLoad } = useGoogleMap(coordinates);
  const [markerPosition, setMarkerPosition] = useState<LatLng>(coordinates);
  const customIcon = {
    url: '/assets/icons/MapPin.png',
    scaledSize: !isLoaded ? undefined : new google.maps.Size(108, 40),
  };
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const newCoordinates = event.latLng?.toJSON();
    if (newCoordinates) {
      setMarkerPosition(newCoordinates);
      onMapClick(newCoordinates.lat, newCoordinates.lng);
    }
  };

  return (
    <>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '100%',
            touchAction: 'none',
          }}
          options={{
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true,
            clickableIcons: false,
          }}
          zoom={18}
          onLoad={onLoad}
          onClick={handleMapClick}
        >
          <MarkerF position={markerPosition} icon={customIcon} />
        </GoogleMap>
      )}
    </>
  );
};

const useGoogleMap = (location: LatLng) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    language: 'ja',
  });

  const onLoad = (map: google.maps.Map) => {
    map.setCenter(location);
  };

  return { isLoaded, onLoad };
};
