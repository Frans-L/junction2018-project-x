import React, { Component } from 'react';
import { createGlobalStyle } from 'styled-components';
import ParkingMap from './components/maps/ParkingMap';
import getCameraData from './services/getCameraPoints';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: undefined,
      cameraPoints: [],
    };
  }

  async componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      const userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.setState({
        center: userPosition,
      });
    });

    this.setState({
      cameraPoints: await getCameraData(),
    });
  }

  render() {
    return (
      <div className="App">
        <ParkingMap center={this.state.center} cameraPoints={this.state.cameraPoints} />
        <GlobalStyle />
      </div>
    );
  }
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;

export default App;
