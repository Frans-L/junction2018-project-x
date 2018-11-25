import React, { Component } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Button, Header, Image, Modal, Icon } from 'semantic-ui-react';
import ParkingMap from './components/maps/ParkingMap';
import getCameraData from './services/getCameraPoints';
import parkingInfo from './data/ParkingInfo';

const UPDATE_INTERVAL = 1500;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMarkers: false,
      showUser: false,
      showMenu: true,
      center: {
        lat: 60.186478,
        lng: 24.834493,
      },
      userPos: null,
      cameraPoints: [],
      showInfo: null,
    };
  }

  async componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      const userPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.setState({
        userPos,
      });
    });
    this.updateData();
    setTimeout(this.setDefaultPosition, 500);
  }

  setDefaultPosition = () => {
    if (!this.state.userPos) {
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
      //console.log(err);
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

  findRoute = address => {
    const { userPos } = this.state;
    window.location.href = `https://www.google.com/maps/dir/${userPos.lat},${
      userPos.lng
    }/${address}`;
  };

  render() {
    const { center, cameraPoints, showInfo, showMenu, showMarkers, showUser, userPos } = this.state;
    const pInfo = parkingInfo[showInfo || 0];
    const showInfoB = showInfo !== null;
    if (center) {
      return (
        <div className="App">
          <ParkingMap
            center={center}
            userPos={userPos}
            cameraPoints={cameraPoints}
            showInfo={showInfo}
            closeInfo={this.closeInfo}
            openInfo={this.openInfo}
            showMarkers={showMarkers}
            showUser={showUser}
          />
          <GlobalStyle />
          <Overlay>
            <Modal open={showMenu} basic size="small">
              <MenuWrapper>
                <Button
                  onClick={this.showMap}
                  basics
                  inverted
                  style={{ margin: '16px', fontSize: '1.25em' }}
                >
                  <Icon name="map" style={{}} /> Open real-time map
                </Button>
                <Button color="white" inverted style={{ margin: '16px', fontSize: '1.25em' }}>
                  <Icon name="search" /> Find the closest free spot
                </Button>
              </MenuWrapper>
            </Modal>
            <Modal open={showInfoB} basic size="small">
              <Modal.Content>
                <h3>{pInfo.address}</h3>
                <div role="list" class="ui list">
                  <div role="listitem" class="item">
                    <i aria-hidden="true" class="euro icon" />
                    <div class="content">Price per hour - {pInfo.price}</div>
                  </div>
                  <div role="listitem" class="item">
                    <i aria-hidden="true" class="clock outline icon" />
                    <div class="content">Maximum parking duration - {pInfo.parkTime}</div>
                  </div>
                  <div role="listitem" class="item">
                    <i aria-hidden="true" class="search icon" />
                    <div class="content">The cars can be parked by the side of the road.</div>
                  </div>
                  <div role="listitem" class="item">
                    <i aria-hidden="true" class="linkify icon" />
                    <div class="content">
                      <a href={`https://www.google.com/maps/place/${pInfo.address}`}>Google Maps</a>
                    </div>
                  </div>
                </div>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={this.closeInfo} color="white" inverted>
                  <Icon name="close" /> Close
                </Button>
                <Button color="white" onClick={() => this.findRoute(pInfo.address)} inverted>
                  <Icon name="map outline" /> Find a route
                </Button>
              </Modal.Actions>
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
