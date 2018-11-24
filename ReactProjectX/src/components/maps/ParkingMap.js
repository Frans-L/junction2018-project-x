import React from 'react'
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polyline, Marker } from "react-google-maps"
import ParkingSpaces from '../../data/ParkingSpaces'
import { distanceFromParkingSpace } from '../../tools/distanceFromLine'

const ParkingMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCe_M1YhbssjRfg9jerKmpMn38jJY6TmT0&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100vh` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)((props) => {

  //console.log("heatPolylines", heatPolylines(ParkingSpaces, props.cameraPoints))

  return <GoogleMap
    defaultZoom={16}
    defaultCenter={props.center}
  >
    {
      /*props.cameraPoints.map((cameraPoint, i) => {
        let pos = {
          lat: cameraPoint.lat,
          lng: cameraPoint.lng
        }
        return <Marker position={pos} key={i} />
      })*/
    }
    {
      //ParkingSpaces.map((parkingSpace, i) => <Polyline path={parkingSpace} options={{ strokeColor: "#FF0000", strokeWeight: 6 }} key={/*JSON.stringify(parkingSpace)*/i} />)

      heatPolylines(ParkingSpaces, props.cameraPoints).map((heatPolyline, i) => {
        let hexHeat = (heatPolyline.heat * 255).toString(16).slice(0, 2)
        console.log(hexHeat)
        return <Polyline path={heatPolyline.path} options={{ strokeColor: `#${hexHeat}0000`, strokeWeight: 6 }} key={i} />
      })
    }
  </GoogleMap>
}
)

function heatPolylines(ParkingSpaces, cameraPoints) {
  let maxHeat = 0

  return ParkingSpaces.map(parkingSpace => {
    return {
      path: parkingSpace,
      heat: cameraPoints
        .slice(0, 10)
        .filter(cameraPoint => cameraPoint.has_car)
        .map(cameraPoint => distanceFromParkingSpace(cameraPoint, parkingSpace))
        .reduce((dist1, dist2) => dist1 + dist2, 0)
    }
  }).map(heatPolyline => {
    if (maxHeat < heatPolyline.heat) maxHeat = heatPolyline.heat
    return heatPolyline
  }).map(heatPolyline => ({
    path: heatPolyline.path,
    heat: heatPolyline.heat / maxHeat
  }))
}

export default ParkingMap