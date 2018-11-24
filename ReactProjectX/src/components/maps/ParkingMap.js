import React from 'react';
import { compose, withProps } from 'recompose';
import colorInterpolate from 'color-interpolate';
import { withScriptjs, withGoogleMap, GoogleMap, Polyline, Marker } from 'react-google-maps';
import ParkingSpaces from '../../data/ParkingSpaces';
import { distanceFromParkingSpace } from '../../tools/distanceFromLine';

const colorMap = colorInterpolate(['green', 'yellow', 'red']);

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
  // console.log("heatPolylines", heatPolylines(parkingSpaces, props.cameraPoints))

  return (
    <GoogleMap defaultZoom={16} defaultCenter={props.center}>
      {/*props.cameraPoints.map((cameraPoint, i) => {
        let pos = {
          lat: cameraPoint.lat,
          lng: cameraPoint.lng
        }
        return <Marker position={pos} key={i} />
      }) */}
      {heatPolylines(ParkingSpaces, props.cameraPoints).map((heatPolyline, i) => {
        const hexHeat = (heatPolyline.heat * 255).toString(16).slice(0, 2);
        console.log(heatPolyline.heat);
        return (
          <Polyline
            path={heatPolyline.path}
            options={{ strokeColor: colorMap(heatPolyline.heat || 0), strokeWeight: 12 }}
            key={i}
          />
        );
      })}
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
          .filter(cameraPoint => cameraPoint.has_car)
          .map(cameraPoint => 1 / distanceFromParkingSpace(cameraPoint, parkingSpace))
          .reduce((dist1, dist2) => dist1 + dist2, 0),
      };
    })
    .map(heatPolyline => {
      if (maxHeat < heatPolyline.heat) maxHeat = heatPolyline.heat;
      return heatPolyline;
    })
    .map(heatPolyline => ({
      path: heatPolyline.path,
      heat: heatPolyline.heat / maxHeat,
    }));
}

export default ParkingMap;
