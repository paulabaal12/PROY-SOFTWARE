import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Linking } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

const RouteOptimizationScreen = ({ route }) => {
  const navigation = useNavigation();
  const { orderId } = route.params;

  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    (async () => {
      // Obtener ubicación actual
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se pudo acceder a la ubicación.');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      // Simulamos la obtención de detalles del pedido
      const details = {
        pickupLatitude: location.coords.latitude + 0.01,
        pickupLongitude: location.coords.longitude + 0.01,
        sellerPhone: '123456789',  // Número del vendedor
        customerName: 'John Doe',
        deliveryAddress: '456 Elm St',
      };
      setPickupLocation({
        latitude: details.pickupLatitude,
        longitude: details.pickupLongitude,
      });
      setOrderDetails(details);

      setLoading(false);
    })();
  }, []);

  const handleConfirmPickup = () => {
    // Simular confirmación de recogida
    Alert.alert('Recogida Confirmada', 'La recogida ha sido confirmada.');
    navigation.navigate('Delivery', { orderId });
  };

  const handleContactSeller = () => {
    const phoneNumber = `tel:${orderDetails.sellerPhone}`;
    Linking.openURL(phoneNumber);
  };

  if (loading || !currentLocation || !pickupLocation || !orderDetails) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ruta al Punto de Recogida</Text>
      <Text style={styles.subtitle}>Cliente: {orderDetails.customerName}</Text>
      <Text style={styles.subtitle}>Dirección de Entrega: {orderDetails.deliveryAddress}</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker coordinate={currentLocation} title="Tu Ubicación" />
        <Marker coordinate={pickupLocation} title="Punto de Recogida" />
        <Polyline
          coordinates={[currentLocation, pickupLocation]}
          strokeColor="#1e90ff"
          strokeWidth={3}
        />
      </MapView>
      <TouchableOpacity style={styles.contactButton} onPress={handleContactSeller}>
        <Text style={styles.buttonText}>Contactar Vendedor</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPickup}>
        <Text style={styles.buttonText}>Confirmar Recogida</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
  },
  loadingText: {
    marginTop: 50,
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  map: {
    flex: 1,
    borderRadius: 10,
    height:'85%',
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

export default RouteOptimizationScreen;
