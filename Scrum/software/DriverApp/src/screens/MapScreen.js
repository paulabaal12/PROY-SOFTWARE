import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, TextInput, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const goBack = () => {
    navigation.goBack();
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setOrigin(currentLocation);
      mapRef.current?.animateToRegion({
        ...currentLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  // Función para buscar lugares
  const searchPlaces = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const mockResults = [
        { id: '1', description: query + ' - Location 1', location: { latitude: 37.78825, longitude: -122.4324 }},
        { id: '2', description: query + ' - Location 2', location: { latitude: 37.78925, longitude: -122.4334 }},
      ];
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching places:', error);
    }
  };

  // Función para seleccionar un lugar
  const selectPlace = (place) => {
    if (!origin) {
      setOrigin(place.location);
    } else {
      setDestination(place.location);
      calculateRoute(origin, place.location);
    }
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const calculateRoute = async (start, end) => {
    try {

      setDistance('5.2 km');
      setDuration('15 min');
      mapRef.current?.fitToCoordinates([start, end], {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mapa</Text>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => setIsSearching(true)}
        >
          <MaterialIcons name="search" size={24} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search location..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              searchPlaces(text);
            }}
            onFocus={() => setIsSearching(true)}
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.currentLocationButton}
          onPress={getCurrentLocation}
        >
          <MaterialIcons name="my-location" size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {isSearching && searchResults.length > 0 && (
        <ScrollView style={styles.searchResults}>
          {searchResults.map((result) => (
            <TouchableOpacity
              key={result.id}
              style={styles.searchResultItem}
              onPress={() => selectPlace(result)}
            >
              <MaterialIcons name="location-on" size={20} color="#666" />
              <Text style={styles.searchResultText}>{result.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {distance && duration && (
        <View style={styles.routeInfo}>
          <Text style={styles.routeInfoText}>Distance: {distance}</Text>
          <Text style={styles.routeInfoText}>Duration: {duration}</Text>
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {origin && (
          <Marker
            coordinate={origin}
            title="Origin"
            pinColor="#4A90E2"
          />
        )}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            pinColor="#FF6B6B"
          />
        )}
        {origin && destination && (
          <Polyline
            coordinates={[origin, destination]}
            strokeColor="#4A90E2"
            strokeWidth={3}
          />
        )}
      </MapView>

      <View style={styles.bottomNavBar}>
        {[
          { icon: 'home', label: 'Home', screen: 'Home' },
          { icon: 'truck', label: 'Orders', screen: 'OrderSelection' },
          { icon: 'map', label: 'Map', screen: 'Map', active: true },
          { icon: 'user', label: 'Profile', screen: 'Profile' }
        ].map((item, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.navBarItem} 
            onPress={() => navigation.navigate(item.screen)}
          >
            <FontAwesome5 
              name={item.icon} 
              size={20} 
              color={item.active ? '#4A90E2' : '#666'} 
            />
            <Text style={[styles.navText, item.active && styles.activeNavText]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60, 
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#4A90E2',
    elevation: 4,
  },
  menuButton: {
    padding: 5,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  currentLocationButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 25,
    elevation: 2,
  },
  searchResults: {
    position: 'absolute',
    top: 170, 
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchResultText: {
    marginLeft: 10,
    fontSize: 16,
  },
  routeInfo: {
    position: 'absolute',
    top: 180,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    zIndex: 1000,
    elevation: 5,
  },
  routeInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  map: {
    flex: 1,
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  activeNavText: {
    color: '#4A90E2',
    fontWeight: '500',
  },
});

export default MapScreen;