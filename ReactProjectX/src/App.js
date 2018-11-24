import React, { Component } from 'react';
import { createGlobalStyle } from 'styled-components'
import ParkingMap from './components/maps/ParkingMap'

class App extends Component {
  render() {
    return (
      <div className="App" >
        <ParkingMap />
        <GlobalStyle />
      </div>
    );
  }
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`

export default App;
