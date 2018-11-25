import React, { Component } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Button, Header, Image, Modal, Icon } from 'semantic-ui-react';
import ParkingMap from './components/maps/ParkingMap';
import getCameraData from './services/getCameraPoints';

const UPDATE_INTERVAL = 1500;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMarkers: false,
      showUser: false,
      showMenu: true,
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

  showMap = () => {
    this.setState({ showMenu: false });
    setTimeout(() => this.setState({ showUser: true }), 250);
    setTimeout(() => this.setState({ showMarkers: true }), 1000);
  };

  render() {
    const { center, cameraPoints, showInfo, showMenu, showMarkers, showUser } = this.state;
    if (center) {
      return (
        <div className="App">
          <ParkingMap
            center={center}
            cameraPoints={cameraPoints}
            showInfo={showInfo}
            closeInfo={this.closeInfo}
            openInfo={this.openInfo}
            showMarkers={showMarkers}
            showUser={showUser}
          />
          <GlobalStyle />
          <Overlay>
            <Modal onClick={this.showMap} open={showMenu} basic size="small">
              <MenuWrapper>
                <Button basics inverted style={{ margin: '16px', fontSize: '1.25em' }}>
                  <Icon name="map" style={{}} /> Open real-time map
                </Button>
                <Button color="white" inverted style={{ margin: '16px', fontSize: '1.25em' }}>
                  <Icon name="search" /> Find the closest free spot
                </Button>
              </MenuWrapper>
            </Modal>
          </Overlay>
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

const Overlay = styled.div`
  position: absolute;
  pointer-events: none;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
`;

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 1;
  max-width: 350px;
  margin: auto;
`;

export default App;
