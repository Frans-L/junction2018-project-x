import React from 'react';
import HeatmapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';

const ParkingMap = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyCe_M1YhbssjRfg9jerKmpMn38jJY6TmT0&v=3.exp&libraries=geometry,drawing,places,visualization',
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '100vh' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withScriptjs,
  withGoogleMap,
)(props => {
  const autismPoints = props.cameraPoints.map(cp => new window.google.maps.LatLng(cp.lat, cp.lng));

  return (
    <GoogleMap defaultZoom={16} defaultCenter={props.center}>
      <HeatmapLayer data={autismPoints} /*options={}*/ />
    </GoogleMap>
  );
});

export default ParkingMap;
