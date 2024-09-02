// src/screens/OrderTrackingScreen.js

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const OrderTrackingScreen = ({ navigation, route }) => {
  const { orderId } = route.params;
  const [status, setStatus] = useState('In Transit');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tracking Order ID: {orderId}</Text>
      <Text style={styles.text}>Current Status: {status}</Text>
      <Button title="Mark as Delivered" onPress={() => setStatus('Delivered')} />
      <Button title="Submit Feedback" onPress={() => navigation.navigate('Feedback', { orderId })} />
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
});

export default OrderTrackingScreen;
