import React, { Component } from 'react';
import { createGlobalStyle } from 'styled-components'
import ParkingMap from './components/maps/ParkingMap'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      center: undefined
    }
  }

  render() {
    return (
      <div className="App" >
        <ParkingMap center={this.state.center} />
        <GlobalStyle />
      </div>
    );
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position)
      let mapsLoc = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      this.setState({
        center: mapsLoc
      })
    })
  }
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`

export default App;
