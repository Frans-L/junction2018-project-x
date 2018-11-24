import React from 'react'
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polyline } from "react-google-maps"

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
  return <GoogleMap
    defaultZoom={16}
    defaultCenter={props.center}
  >
    <Polyline path={[{ lat: -34.397, lng: 150.644 }, { lat: -35.397, lng: 149.644 }]} />
  </GoogleMap>
}
)

export default ParkingMap