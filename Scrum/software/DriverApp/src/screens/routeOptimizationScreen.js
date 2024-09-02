// src/screens/RouteOptimizationScreen.js

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const RouteOptimizationScreen = ({ navigation, route }) => {
  const { orderId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Optimized Route for Order ID: {orderId}</Text>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Map Placeholder</Text>
      </View>
      <Button title="Start Tracking" onPress={() => navigation.navigate('OrderTracking', { orderId })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  mapPlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mapText: {
    color: '#888',
  },
});

export default RouteOptimizationScreen;
