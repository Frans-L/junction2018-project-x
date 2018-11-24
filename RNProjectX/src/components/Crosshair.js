import React from 'react';
import { StyleSheet, View } from 'react-native';

export const Crosshair = () => {
  const Vertical = () => (
    <View style={styles.border}>
      <View style={styles.borderVertical} />
      <View style={styles.borderVertical} />
      <View style={styles.borderVertical} />
    </View>
  );

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Vertical />
      <Vertical />
      <Vertical />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    flex: 1,
    flexDirection: 'column-reverse',
    alignContent: 'center',
  },
  border: {
    borderColor: 'white',
    flexDirection: 'row',
    borderWidth: 1,
    flex: 1,
  },
  borderVertical: {
    borderColor: 'white',
    borderWidth: 1,
    flex: 1,
  },
});
