import React from 'react'
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polyline } from "react-google-maps"
import ParkingSpaces from '../../data/ParkingSpaces'

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
    {ParkingSpaces.map(parkingSpace => <Polyline path={parkingSpace} key={JSON.stringify(parkingSpace)} />)}
  </GoogleMap>
}
)

export default ParkingMap