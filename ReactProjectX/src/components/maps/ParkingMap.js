import React from 'react';
import { compose, withProps } from 'recompose';
import colorInterpolate from 'color-interpolate';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Polyline,
  Marker,
  InfoWindow,
} from 'react-google-maps';
import styled from 'styled-components';

import parkingSpaces from '../../data/ParkingSpaces';
import parkingInfo from '../../data/ParkingInfo';
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
  // console.log("heatPolylines", heatPolylines(parkingSpaces, props.cameraPoints))
  console.log(props);
  return (
    <GoogleMap defaultZoom={16} defaultCenter={props.center} options={{ styles }}>
      {false &&
        props.cameraPoints
          .filter(cp => cp.cars > 0)
          .map((cameraPoint, i) => {
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
              strokeWeight: 6,
            }}
            key={i}
          />
        );
      })}
      {props.showUser && (
        <Marker
          position={props.userPos}
          icon="/images/car.png"
          animation={window.google.maps.Animation.DROP}
        />
      )}
      {props.showMarkers && (
        <ParkMarkers
          showInfo={props.showInfo}
          openInfo={props.openInfo}
          closeInfo={props.closeInfo}
        />
      )}
    </GoogleMap>
  );
});

const ParkMarkers = ({ showInfo, openInfo, closeInfo }) => {
  return parkingInfo.map((sign, i) => {
    return (
      <Marker
        position={sign}
        icon="/images/p_sign.png"
        animation={window.google.maps.Animation.DROP}
        key={i}
        onClick={() => openInfo(i)}
      >
        {showInfo === i && (
          <InfoWindow onCloseClick={() => closeInfo}>
            <InfoWindowContainer>
              <b>{sign.address}</b>
              <br />
              <br />
              Price: {sign.price}€/h
              <br />
              Time: {sign.parkTime}
            </InfoWindowContainer>
          </InfoWindow>
        )}
      </Marker>
    );
  });
};

function heatPolylines(parkingSpaces, cameraPoints) {
  let maxHeat = 0;

  return parkingSpaces
    .map(parkingSpace => {
      return {
        path: parkingSpace,
        heat: cameraPoints.filter(cp => distanceFromParkingSpace(cp, parkingSpace) < 0.0005).length,
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

const InfoWindowContainer = styled.div`
  margin: 16px;
  flex-basis: 1;
`;

export default ParkingMap;

function parkingSpaceLength(ps) {
  return ((ps[0].lat - ps[1].lat) ** 2 + (ps[0].lng - ps[1].lng) ** 2) ** 0.5;
}
