import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Button, Text, Icon } from 'native-base';
import { sendImage } from '../services/upload';
import { getPosition } from '../services/location';

const CAPTURE_INTERVAL = 750;

class CameraScreen extends React.Component {
  state = {
    sendStatus: 'idle',
    capturing: false,
  };

  onCapturePress = () => {
    this.setState(state => {
      if (!state.capturing) this.capture();
      return { capturing: !state.capturing };
    });
  };

  capture = async () => {
    if (this.camera) {
      const options = {
        width: 480,
      };
      const capture = this.camera.takePictureAsync(options);
      const getLocation = getPosition();
      const results = await Promise.all([capture, getLocation]);

      const uri = results[0].uri; // eslint-disable-line
      const location = results[1].coords;

      console.log({ uri, location });

      try {
        await sendImage({ uri, location });
        this.setState({ sendStatus: 'success' });
      } catch (err) {
        console.log(err);
        this.setState({ sendStatus: 'fail' });
      } finally {
        setTimeout(() => {
          this.setState({ sendStatus: 'idle' });
        }, CAPTURE_INTERVAL);
      }

      const { capturing } = this.state;
      if (capturing) setTimeout(this.capture, CAPTURE_INTERVAL);
    }
  };

  StatusIcon = ({ sendStatus }) => {
    if (sendStatus === 'success')
      return <Icon style={{ alignSelf: 'center', color: 'white' }} name="checkmark" />;
    if (sendStatus === 'fail')
      return <Icon style={{ alignSelf: 'center', color: 'red' }} name="bug" />;
    return null;
  };

  render() {
    const { sendStatus, capturing } = this.state;
    console.log(capturing);
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={{ flex: 1 }}
        />
        <View style={styles.overlay}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.footerView} />
            <View style={styles.footerView}>
              <Button
                onPress={this.onCapturePress}
                icon
                rounded
                light={!capturing}
                danger={capturing}
                style={styles.capture}
              >
                <Icon style={{ color: capturing ? 'white' : 'black' }} name="camera" />
              </Button>
            </View>
            <View style={styles.footerView}>
              <this.StatusIcon sendStatus={sendStatus} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    flex: 1,
    flexDirection: 'column-reverse',
    alignContent: 'center',
  },
  footerView: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    margin: 16,
    marginBottom: 32,
  },
  capture: {
    alignSelf: 'center',
    padding: 8,
    opacity: 0.75,
  },
});

export default CameraScreen;
