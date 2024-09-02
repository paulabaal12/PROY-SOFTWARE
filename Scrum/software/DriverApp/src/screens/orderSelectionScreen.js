// src/screens/OrderSelectionScreen.js

import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

const OrderSelectionScreen = ({ navigation }) => {
  const orders = [
    { id: '1', pickupAddress: '123 Main St', deliveryAddress: '456 Elm St' },
    { id: '2', pickupAddress: '789 Oak St', deliveryAddress: '101 Pine St' },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text>{item.pickupAddress} {'>'} {item.deliveryAddress}</Text>
            <Button title="Select" onPress={() => navigation.navigate('RouteOptimization', { orderId: item.id })} />
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  orderItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
});

export default OrderSelectionScreen;
