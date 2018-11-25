import React from 'react';
import { compose, withProps } from 'recompose';
import colorInterpolate from 'color-interpolate';
import { withScriptjs, withGoogleMap, GoogleMap, Polyline, Marker } from 'react-google-maps';
import parkingSpaces from '../../data/ParkingSpaces';
import { distanceFromParkingSpace } from '../../tools/distanceFromLine';
import styles from './styles';

const colorMap = colorInterpolate(['#4bb643', 'yellow', '#fb5050']);

const ParkingMap = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyCe_M1YhbssjRfg9jerKmpMn38jJY6TmT0&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '100vh' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withScriptjs,
  withGoogleMap,
)(props => {
  return (
    <GoogleMap defaultZoom={16} defaultCenter={props.center} options={{ styles }}>
      {process.env.DEBUG &&
        props.cameraPoints.map((cameraPoint, i) => {
          const pos = {
            lat: cameraPoint.lat,
            lng: cameraPoint.lng,
          };
          return <Marker position={pos} key={i} />;
        })}
      {heatPolylines(parkingSpaces, props.cameraPoints).map((heatPolyline, i) => {
        return (
          <Polyline
            path={heatPolyline.path}
            options={{
              strokeColor: heatPolyline.heatEnabled ? colorMap(heatPolyline.heat || 0) : '#999999',
              strokeWeight: 12,
            }}
            key={i}
          />
        );
      })}
      <Marker position={props.center} icon="/images/car.png" />
    </GoogleMap>
  );
});

function heatPolylines(parkingSpaces, cameraPoints) {
  let maxHeat = 0;

  return parkingSpaces
    .map(parkingSpace => {
      return {
        path: parkingSpace,
        heat: cameraPoints
          .map(
            cameraPoint =>
              cameraPoint.weight / distanceFromParkingSpace(cameraPoint, parkingSpace) ** 2,
          )
          .reduce((dist1, dist2) => dist1 + dist2, 0),
        heatEnabled:
          cameraPoints
            .map(cameraPoint => distanceFromParkingSpace(cameraPoint, parkingSpace))
            .sort()[0] < 0.001,
      };
    })
    .map(heatPolyline => {
      if (maxHeat < heatPolyline.heat) maxHeat = heatPolyline.heat;
      return heatPolyline;
    })
    .map(heatPolyline => ({
      path: heatPolyline.path,
      heat: heatPolyline.heat / maxHeat,
      heatEnabled: heatPolyline.heatEnabled,
    }));
}

export default ParkingMap;
