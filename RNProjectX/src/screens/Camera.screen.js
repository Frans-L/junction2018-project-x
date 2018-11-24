import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Button, Text, Icon } from 'native-base';
import { sendImage } from '../services/upload';
import { getPosition } from '../services/location';

class CameraScreen extends React.Component {
  state = {
    sendStatus: 'idle',
  };

  onCapture = async () => {
    if (this.camera) {
      const options = {
        width: 480,
      };
      const capture = this.camera.takePictureAsync(options);
      const getLocation = getPosition();
      const results = await Promise.all([capture, getLocation]);

      const data = results[0];
      const location = results[1];

      console.log({ data, location });

      try {
        await sendImage({ uri: data.uri });
        this.setState({ sendStatus: 'success' });
      } catch (err) {
        console.log(err);
        this.setState({ sendStatus: 'fail' });
      } finally {
        setTimeout(() => {
          this.setState({ sendStatus: 'idle' });
        }, 750);
      }
    }
  };

  StatusIcon = ({ sendStatus }) => {
    if (sendStatus === 'success')
      return <Icon style={{ alignSelf: 'center', color: 'green' }} name="checkmark" />;
    if (sendStatus === 'fail')
      return <Icon style={{ alignSelf: 'center', color: 'red' }} name="bug" />;
    return null;
  };

  render() {
    const { sendStatus } = this.state;
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
              <Button onPress={this.onCapture} icon rounded light style={styles.capture}>
                <Icon name="camera" />
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
