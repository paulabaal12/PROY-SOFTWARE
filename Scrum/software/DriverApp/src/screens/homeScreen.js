// src/screens/HomeScreen.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, FlatList, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  // Datos de Placeholder para el Vendedor y el Comprador
  const sellerInfo = {
    name: 'Vendedor Ejemplo',
    phone: '555-1234',
    email: 'vendedor@ejemplo.com',
  };

  const buyerInfo = {
    name: 'Comprador Ejemplo',
    phone: '555-5678',
    email: 'comprador@ejemplo.com',
  };

  const availableOrders = [
    { id: '1', customer: 'John Doe', location: '123 Main St', orderDetails: '2 paquetes' },
    { id: '2', customer: 'Jane Smith', location: '456 Elm St', orderDetails: '1 paquete' },
    { id: '3', customer: 'John Doe', location: '123 Main St', orderDetails: '2 paquetes' },
    { id: '4', customer: 'Jane Smith', location: '456 Elm St', orderDetails: '1 paquete' },
  ];

  const actions = [
    { id: '1', title: 'Track Orders', icon: 'truck', screen: 'OrderSelection' },
    { id: '2', title: 'Contact Seller', icon: 'phone', screen: 'ContactSeller' },
    { id: '3', title: 'Contact Buyer', icon: 'envelope', screen: 'ContactBuyer' },
    { id: '4', title: 'Order History', icon: 'history', screen: 'OrderHistory' },
  ];

  const handleSelectOrder = async (order) => {
    try {
      console.log(`Selected order ${order.id}`);
      
      const placeholderResponse = {
        available: true,
      };

      if (placeholderResponse.available) {
        // Navigate to the OrderDetailsScreen with order details
        navigation.navigate('OrderDetails', { 
          orderId: order.id,
          customer: order.customer,
          location: order.location,
          orderDetails: order.orderDetails
        });
      } else {
        alert('Order is no longer available');
      }
    } catch (error) {
      console.error('Error validating order:', error);
      alert('Error validating order, please try again later.');
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Título */}
      <Text style={styles.headerTitle}>Available Orders</Text>

      {/* Slideshow de Pedidos Disponibles */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slideshow}>
        {availableOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <Text style={styles.orderText}>Customer: {order.customer}</Text>
            <Text style={styles.orderText}>Location: {order.location}</Text>
            <Text style={styles.orderText}>Order: {order.orderDetails}</Text>
            <TouchableOpacity 
              style={styles.selectButton} 
              onPress={() => handleSelectOrder(order)}
            >
              <Text style={styles.selectButtonText}>Start Delivery</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Sección de Acciones */}
      <Text style={styles.sectionTitle}>Actions</Text>
      <FlatList
        data={actions}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => {
              if (item.screen === 'ContactSeller') {
                navigation.navigate('ContactSeller', { 
                  sellerName: sellerInfo.name, 
                  sellerPhone: sellerInfo.phone, 
                  sellerEmail: sellerInfo.email 
                });
              } else if (item.screen === 'ContactBuyer') {
                navigation.navigate('ContactBuyer', { 
                  buyerName: buyerInfo.name, 
                  buyerPhone: buyerInfo.phone, 
                  buyerEmail: buyerInfo.email 
                });
              } else {
                navigation.navigate(item.screen);
              }
            }}
          >
            <FontAwesome name={item.icon} size={40} color="#1e90ff" />
            <Text style={styles.actionTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.actionRow}
      />

      {/* Barra de Navegación Inferior */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity style={styles.navBarItem} onPress={() => navigation.navigate('Home')}>
          <FontAwesome name="home" size={24} color="#1e90ff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarItem} onPress={() => navigation.navigate('OrderSelection')}>
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
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 35,
    color: '#333',
    textAlign: 'center',
  },
  slideshow: {
    marginBottom: 15,
  },
  orderCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginRight: 10,
    width: 250,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  selectButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  actionRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
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
    position: 'relative',
    bottom: 10,
    width: '100%',
  },
  navBarItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    color: '#333',
  },
});

export default HomeScreen;
