import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Button, Text, Icon } from 'native-base';
import { sendImage } from '../services/upload';

class CameraScreen extends React.Component {
  onCapture = async () => {
    if (this.camera) {
      const options = {
        width: 480,
      };
      const data = await this.camera.takePictureAsync(options);
      console.log({ data });
      sendImage({ uri: data.uri });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={{ flex: 1 }}
        >
          <View style={styles.overlay}>
            <Button onPress={this.onCapture} icon rounded light style={styles.capture}>
              <Icon name="camera" />
            </Button>
          </View>
        </RNCamera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    flexDirection: 'column-reverse',
    alignContent: 'center',
  },
  capture: {
    alignSelf: 'center',
    margin: 16,
    marginBottom: 32,
    padding: 8,
    opacity: 0.75,
  },
});

export default CameraScreen;
