// src/screens/OrderHistoryScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
// import axios from 'axios';
// import { API_BASE_URL } from '../config/api'; // Comentado porque no se usa en esta iteración

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Datos de Placeholder
  const mockOrders = [
    {
      id: 1,
      status: 'Delivered',
      date: '2023-10-01',
    },
    {
      id: 2,
      status: 'In Transit',
      date: '2023-10-05',
    },
    {
      id: 3,
      status: 'Cancelled',
      date: '2023-09-25',
    },
    // Agrega más órdenes según sea necesario
  ];

  useEffect(() => {
    // Simular una carga de datos con un retardo
    const loadData = () => {
      // Simula una llamada a la API
      setTimeout(() => {
        setOrders(mockOrders);
        setLoading(false);
      }, 1000); // Retardo de 1 segundo
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#1e90ff" />
        <Text>Loading Order History...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Order History</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.orderText}>Order ID: {item.id}</Text>
            <Text style={styles.orderText}>Status: {item.status}</Text>
            <Text style={styles.orderText}>Date: {new Date(item.date).toLocaleDateString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No past orders found.</Text>}
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop:25,
    textAlign: 'center',
  },
  orderItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  orderText: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrderHistoryScreen;
