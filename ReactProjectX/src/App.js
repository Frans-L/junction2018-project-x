import React, { Component } from 'react';
import { createGlobalStyle } from 'styled-components';
import ParkingMap from './components/maps/ParkingMap';
import getCameraData from './services/getCameraPoints';

const UPDATE_INTERVAL = 1500;

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
    this.updateData();
  }

  updateData = async () => {
    this.setState({
      cameraPoints: await getCameraData(),
    });
    setTimeout(this.updateData, UPDATE_INTERVAL);
  };

  render() {
    const { center, cameraPoints } = this.state;
    return (
      <div className="App">
        <ParkingMap center={center} cameraPoints={cameraPoints} />
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
