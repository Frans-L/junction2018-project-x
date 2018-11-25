import React, { Component } from 'react';
import { createGlobalStyle } from 'styled-components';
import ParkingMap from './components/maps/ParkingMap';
import getCameraData from './services/getCameraPoints';

const UPDATE_INTERVAL = 1500;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: null,
      cameraPoints: [],
      showInfo: null,
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
    setTimeout(this.setDefaultPosition, 500);
  }

  setDefaultPosition = () => {
    if (!this.state.center) {
      this.setState({
        center: {
          lat: 60.18497,
          lng: 24.832362,
        },
      });
    }
  };

  updateData = async () => {
    try {
      this.setState({
        cameraPoints: await getCameraData(),
      });
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(this.updateData, UPDATE_INTERVAL);
    }
  };

  openInfo = i => {
    this.setState({ showInfo: i });
  };

  closeInfo = () => {
    this.setState({ showInfo: null });
  };

  render() {
    const { center, cameraPoints, showInfo } = this.state;
    if (center) {
      return (
        <div className="App">
          <ParkingMap
            center={center}
            cameraPoints={cameraPoints}
            showInfo={showInfo}
            closeInfo={this.closeInfo}
            openInfo={this.openInfo}
          />
          <GlobalStyle />
        </div>
      );
    }
    return <div>Loading</div>;
  }
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;

export default App;
