import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const OrderDetailsScreen = ({ navigation, route }) => {
  const { orderId, customer, location, orderDetails } = route.params; // Obtener detalles del pedido desde los parámetros
  const [currentLocation, setCurrentLocation] = useState(null); // Ubicación actual del repartidor
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener ubicación actual del repartidor
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text>Loading your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Mapa con la ruta */}
      <Text style={styles.headerText}>Order Details for Order ID: {orderId}</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker
          coordinate={{
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          }}
          title="You are here"
        />
        {/* Agregar marcador para la ubicación de entrega */}
        <Marker
          coordinate={{
            latitude: 14.634915, // Coordenadas de ejemplo
            longitude: -90.506882, // Coordenadas de ejemplo
          }}
          title={location}
          description="Delivery location"
        />
      </MapView>

      {/* Detalles del pedido */}
      <View style={styles.orderDetails}>
        <Text style={styles.detailText}>Customer: {customer}</Text>
        <Text style={styles.detailText}>Location: {location}</Text>
        <Text style={styles.detailText}>Order: {orderDetails}</Text>
      </View>

      {/* Botones de acción */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('MapNavigation', { location })}
        >
          <Text style={styles.buttonText}>Start Navigation</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => console.log("Contact Seller/Customer")}
        >
          <Text style={styles.buttonText}>Contact Seller</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => console.log("Confirm Pickup/Delivery")}
        >
          <Text style={styles.buttonText}>Confirm Pickup</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  orderDetails: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 8,
    width: '30%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrderDetailsScreen;
