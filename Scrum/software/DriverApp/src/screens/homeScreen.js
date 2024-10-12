import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Card, Button } from 'react-native-paper';

const HomeScreen = () => {
  const navigation = useNavigation();
  
  // Mock data for available orders
  const availableOrders = [
    { id: '1', customer: 'John Doe', location: '123 Main St', orderDetails: '2 packages' },
    { id: '2', customer: 'Jane Smith', location: '456 Elm St', orderDetails: '1 package' },
    { id: '3', customer: 'Bob Johnson', location: '789 Pine St', orderDetails: '3 packages' },
  ];

  const actions = [
    { id: '1', title: 'Track Orders', icon: 'truck', screen: 'OrderTracking' },
    { id: '2', title: 'Find Courier', icon: 'motorcycle', screen: 'Courier' },
    { id: '3', title: 'View Feedback', icon: 'comments', screen: 'Feedback' },
    { id: '4', title: 'Notifications', icon: 'bell', screen: 'Notifications' },
  ];

  const renderOrder = ({ item }) => (
    <Card style={styles.orderCard}>
      <Card.Content>
        <Text style={styles.orderText}>Customer: {item.customer}</Text>
        <Text style={styles.orderText}>Location: {item.location}</Text>
        <Text style={styles.orderText}>Order: {item.orderDetails}</Text>
      </Card.Content>
      <Card.Actions>
        <Button 
          mode="contained" 
          style={styles.orderButton} 
          onPress={() => navigation.navigate('RouteOptimization', { orderId: item.id })}
        >
          Start Delivery
        </Button>
      </Card.Actions>
    </Card>
  );

  const renderActionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.actionCard}
      onPress={() => navigation.navigate(item.screen)}
    >
      <FontAwesome name={item.icon} size={36} color="#fcbf49" />
      <Text style={styles.actionTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
    <StatusBar barStyle="dark-content" />
      {/* Slideshow of Available Orders */}
      <Text style={styles.headerTitle}>Available Orders</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slideshow}>
        {availableOrders.map((order) => renderOrder({ item: order }))}
      </ScrollView>

      {/* Action Cards Section */}
      <Text style={styles.sectionTitle}>Actions</Text>
      <View style={styles.actionRow}>
        {actions.map((action) => renderActionItem({ item: action }))}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity style={styles.navBarItem} onPress={() => navigation.navigate('Home')}>
          <FontAwesome name="home" size={24} color="#1e90ff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarItem} onPress={() => navigation.navigate('OrderTracking')}>
          <FontAwesome name="truck" size={24} color="#666" />
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarItem} onPress={() => navigation.navigate('Map')}>
          <FontAwesome name="map" size={24} color="#666" />
          <Text style={styles.navText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarItem} onPress={() => navigation.navigate('Profile')}>
          <FontAwesome name="user" size={24} color="#666" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:0,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerTitle: {
    fontSize: 22,
    marginTop:25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  slideshow: {
    marginBottom: 15,  // Reducir margen para subir las acciones
  },
  orderCard: {

    backgroundColor: '#f5f5f5',
    padding: 0,
    borderRadius: 10,
    marginRight: 10,
    width: 200,
    height:300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height:2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 10,
  },
  orderButton: {
    backgroundColor: '#1e90ff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop:0,
  },
actionCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,  // Ajusta el padding para el espacio interior
    borderRadius: 10,
    alignItems: 'center',
    flex: 2,  // Ajusta para que las tarjetas se adapten al ancho de la fila
    marginHorizontal: 5,  // Espacio entre tarjetas
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    width: 150,  // Modifica el ancho de la tarjeta de acción
},

  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    color: '#333',
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navBarItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default HomeScreen;
