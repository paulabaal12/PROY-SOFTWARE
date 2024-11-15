// src/screens/MapScreen.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
  const navigation = useNavigation();

  // Función para abrir el Drawer Navigator
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  // Función para regresar a la pantalla anterior
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header con Menú de Hamburguesa y Botón de Regreso */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <MaterialIcons name="menu" size={28} color="#1e90ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Map</Text>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color="#1e90ff" />
        </TouchableOpacity>
      </View>

      {/* Mapa */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825, // Coordenadas de ejemplo
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Ejemplo de un marcador */}
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title={"Ubicación de Ejemplo"}
          description={"Descripción de la ubicación"}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: StatusBar.currentHeight || 25,
    marginTop:15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    zIndex: 1,
  },
  menuButton: {
    padding: 5,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  map: {
    width: width,
    height: height - (StatusBar.currentHeight || 20) - 50, // Ajusta según el height del header
  },
});

export default MapScreen;
