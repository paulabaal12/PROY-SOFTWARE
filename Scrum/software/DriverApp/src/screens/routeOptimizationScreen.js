import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const RouteOptimizationScreen = ({ navigation, route }) => {
  const { orderId, location } = route.params; // Obtener orderId y location de los parámetros de la ruta
  const [mapLoaded, setMapLoaded] = useState(false); // Estado para manejar si el mapa está cargado

  useEffect(() => {
    if (location) {
      setMapLoaded(true); // Marcar el mapa como cargado si la ubicación está disponible
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Optimized Route for Order ID: {orderId}</Text>

      {location ? (
        <TouchableOpacity 
          style={styles.mapContainer} 
          onPress={() => navigation.navigate('Map')}
        >
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01, // Delta más pequeño para un zoom más cercano
              longitudeDelta: 0.01,
            }}
            liteMode={true} // Esto reduce la carga de renderizado
            scrollEnabled={false} // Deshabilitar el desplazamiento para hacer una vista previa estática
            zoomEnabled={false} // Deshabilitar el zoom
            onMapReady={() => setMapLoaded(true)} // Marcar el mapa como listo cuando esté cargado
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
              description="This is your current location"
            />
          </MapView>
        </TouchableOpacity>
      ) : (
        <Text style={styles.text}>Loading map...</Text> // Mostrar mensaje de carga si la ubicación no está disponible
      )}

      {!mapLoaded && <Text style={styles.loadingText}>Loading map...</Text>} {/* Mostrar texto de carga hasta que el mapa esté listo */}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OrderTracking', { orderId })}>
        <Text style={styles.buttonText}>Start Tracking</Text>
      </TouchableOpacity>
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
  mapContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
});

export default RouteOptimizationScreen;