// src/screens/DeliveryScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Linking } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

const DeliveryScreen = ({ route }) => {
  const navigation = useNavigation();
  const { orderId } = route.params;

  const [pickupLocation, setPickupLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulamos la obtención de datos de la orden
  useEffect(() => {
    // Simular ubicaciones
    const orderDetails = {
      pickupLatitude: 37.7749,
      pickupLongitude: -122.4194,
      deliveryLatitude: 37.7849,
      deliveryLongitude: -122.4094,
      buyerPhone: '987654321', // Número de teléfono del comprador simulado
    };
    setPickupLocation({
      latitude: orderDetails.pickupLatitude,
      longitude: orderDetails.pickupLongitude,
    });
    setDeliveryLocation({
      latitude: orderDetails.deliveryLatitude,
      longitude: orderDetails.deliveryLongitude,
    });
    setLoading(false);
  }, []);

  const handleConfirmDelivery = () => {
    // Simular actualización del estado de la orden a 'delivered'
    Alert.alert('Entrega Confirmada', 'La orden ha sido entregada exitosamente.');
    navigation.navigate('Home');
  };

  const handleContactBuyer = () => {
    const phoneNumber = 'tel:987654321'; // Reemplaza con el número del comprador
    Linking.openURL(phoneNumber);
  };

  if (loading || !pickupLocation || !deliveryLocation) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ruta al Punto de Entrega</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: pickupLocation.latitude,
          longitude: pickupLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={pickupLocation} title="Punto de Recogida" />
        <Marker coordinate={deliveryLocation} title="Punto de Entrega" />
        <Polyline
          coordinates={[pickupLocation, deliveryLocation]}
          strokeColor="#1e90ff"
          strokeWidth={3}
        />
      </MapView>
      <TouchableOpacity style={styles.contactButton} onPress={handleContactBuyer}>
        <Text style={styles.buttonText}>Contactar Comprador</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmDelivery}>
        <Text style={styles.buttonText}>Confirmar Entrega</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Usa los mismos estilos que en RouteOptimizationScreen
  container: {
    flex: 1,
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  map: {
    flex: 1,
    borderRadius: 10,
  },
  contactButton: {
    backgroundColor: '#fcbf49',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#1e90ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DeliveryScreen;
