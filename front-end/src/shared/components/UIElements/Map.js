import { useCallback } from 'react';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const API_KEY = 'AIzaSyBeVl6E01OLwzFIV6fEV5oheF-yKteq1IM';

const Map = (props) => {
    const containerStyle = {
        width: '100%',
        height: '100%'
      };

    const { center, zoom } = props;

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY
    });
    
    const onLoad = useCallback((map) => {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
    }, [center]); 

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            onLoad={onLoad}
        >
            <Marker position={center} />
        </GoogleMap>
    ) : <></>
};

export default Map;