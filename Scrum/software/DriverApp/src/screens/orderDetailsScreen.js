import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

const OrderDetailsScreen = ({ navigation, route }) => {
  const { orderId, customer, location, orderDetails } = route.params;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        <ActivityIndicator color="#1e90ff" />
        <Text>Loading your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Order Details for Order ID: {orderId}</Text>

      {/* Map Section */}
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
        <Marker
          coordinate={{
            latitude: 14.634915,
            longitude: -90.506882,
          }}
          title={location}
          description="Delivery location"
        />
      </MapView>

      {/* Details Section */}
      <View style={styles.orderDetails}>
        <Text style={styles.detailText}><FontAwesome name="user" size={16} /> Customer: {customer}</Text>
        <Text style={styles.detailText}><FontAwesome name="map-marker" size={16} /> Location: {location}</Text>
        <Text style={styles.detailText}><FontAwesome name="truck-ramp-box"  size={16} /> Order: {orderDetails}</Text>
      </View>

      {/* Buttons Section */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('MapNavigation', { location })}
        >
          <FontAwesome name="location-arrow" size={16} color="#fff" />
          <Text style={styles.buttonText}>Start Navigation</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => console.log("Contact Seller/Customer")}
        >
          <FontAwesome name="phone" size={16} color="#fff" />
          <Text style={styles.buttonText}>Contact Seller</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => console.log("Confirm Pickup/Delivery")}
        >
          <FontAwesome name="check" size={16} color="#fff" />
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
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop:50,
    textAlign: 'center',
    color: '#333',
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  orderDetails: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',

    marginTop: 20,
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom:25,
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'center',
    width:185,
    height :65,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrderDetailsScreen;
