import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

const LocationLoadingScreen = ({ navigation, route }) => {
  const { orderId } = route.params; // Obtener orderId de los parámetros de la ruta
  const [errorMsg, setErrorMsg] = useState(null); // Estado para manejar mensajes de error

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      navigation.navigate('RouteOptimization', { orderId, location }); // Navegar a RouteOptimizationScreen con la ubicación
    })();
  }, []);

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text style={styles.text}>{errorMsg}</Text> // Mostrar mensaje de error si existe
      ) : (
        <ActivityIndicator size="large" color="#0000ff" /> // Mostrar indicador de carga mientras se obtiene la ubicación
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'red',
  },
});

export default LocationLoadingScreen;