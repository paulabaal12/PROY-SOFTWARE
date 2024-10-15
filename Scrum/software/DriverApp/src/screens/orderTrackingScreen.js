import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

const OrderTrackingScreen = ({ navigation, route }) => {
  const { orderId, customer, pickupLocation, deliveryLocation, orderDetails } = route.params; // Información del pedido
  const [currentLocation, setCurrentLocation] = useState(null); // Ubicación actual del repartidor
  const [loading, setLoading] = useState(true);
  const [orderStage, setOrderStage] = useState('Pickup'); // Estado del pedido

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
      <Text style={styles.headerText}>Order ID: {orderId} - {orderStage}</Text>

      {/* Mapa con ubicación actual y destino */}
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
        {/* Marcador de la ubicación de recogida o entrega */}
        <Marker
          coordinate={orderStage === 'Pickup' ? pickupLocation : deliveryLocation}
          title={orderStage === 'Pickup' ? 'Pickup Location' : 'Delivery Location'}
          description={orderStage === 'Pickup' ? 'Pick up the order here' : 'Deliver the order here'}
        />
        {/* Línea entre el repartidor y el destino */}
        <Polyline
          coordinates={[
            { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
            orderStage === 'Pickup' ? pickupLocation : deliveryLocation,
          ]}
          strokeColor="#1e90ff"
          strokeWidth={3}
        />
      </MapView>

      {/* Detalles del Pedido */}
      <View style={styles.orderDetails}>
        <Text style={styles.detailText}>Customer: {customer}</Text>
        <Text style={styles.detailText}>Pickup: {pickupLocation?.address || 'Pickup location not available'}</Text>
        <Text style={styles.detailText}>Delivery: {deliveryLocation?.address || 'Delivery location not available'}</Text>
        <Text style={styles.detailText}>Order: {orderDetails}</Text>
      </View>


      {/* Botones de acción */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => console.log("Start Navigation")}
        >
          <Text style={styles.buttonText}>Start Navigation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => console.log("Contact Seller/Customer")}
        >
          <Text style={styles.buttonText}>Contact Seller/Customer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (orderStage === 'Pickup') {
              setOrderStage('Delivery'); // Cambiar a la etapa de entrega
            } else {
              console.log("Order Delivered");
              navigation.goBack(); // Volver a la pantalla anterior
            }
          }}
        >
          <Text style={styles.buttonText}>
            {orderStage === 'Pickup' ? 'Confirm Pickup' : 'Confirm Delivery'}
          </Text>
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
    marginTop: 55,
    textAlign: 'center',
  },
  map: {
    width: '100%',
    height: 200,
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

export default OrderTrackingScreen;
