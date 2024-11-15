import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const OrderSelectionScreen = ({ navigation }) => {
  const orders = [
    { 
      id: '1', 
      pickupAddress: '123 Main St', 
      deliveryAddress: '456 Elm St',
      customer: 'John Doe',
      packageCount: 2,
      distance: '3.2 km',
      estimatedTime: '15 min'
    },
    { 
      id: '2', 
      pickupAddress: '789 Oak St', 
      deliveryAddress: '101 Pine St',
      customer: 'Jane Smith',
      packageCount: 1,
      distance: '4.5 km',
      estimatedTime: '20 min'
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select an Order</Text>
      </View>

      {/* Order List */}
      <FlatList
        data={orders}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.customerInfo}>
                <FontAwesome5 name="user" size={14} color="#4A90E2" />
                <Text style={styles.customerText}>{item.customer}</Text>
              </View>
              <View style={styles.packageInfo}>
                <FontAwesome5 name="box" size={14} color="#666" />
                <Text style={styles.packageText}>{item.packageCount} packages</Text>
              </View>
            </View>

            <View style={styles.addressContainer}>
              <View style={styles.addressRow}>
                <FontAwesome5 name="map-marker-alt" size={14} color="#50C878" />
                <Text style={styles.addressText}>{item.pickupAddress}</Text>
              </View>
              <View style={styles.connector}>
                <View style={styles.connectorLine} />
                <FontAwesome5 name="chevron-down" size={14} color="#999" />
              </View>
              <View style={styles.addressRow}>
                <FontAwesome5 name="flag-checkered" size={14} color="#FF6B6B" />
                <Text style={styles.addressText}>{item.deliveryAddress}</Text>
              </View>
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <FontAwesome5 name="road" size={14} color="#666" />
                <Text style={styles.detailText}>{item.distance}</Text>
              </View>
              <View style={styles.detailItem}>
                <FontAwesome5 name="clock" size={14} color="#666" />
                <Text style={styles.detailText}>{item.estimatedTime}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => navigation.navigate('RouteOptimization', { orderId: item.id })}
            >
              <Text style={styles.selectButtonText}>Select Order</Text>
              <FontAwesome5 name="arrow-right" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        {[
          { icon: 'home', label: 'Home', screen: 'Home' },
          { icon: 'truck', label: 'Orders', screen: 'OrderSelection', active: true },
          { icon: 'map', label: 'Map', screen: 'Map' },
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#4A90E2',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContainer: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  packageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  addressContainer: {
    marginBottom: 15,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  addressText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#444',
    flex: 1,
  },
  connector: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
  },
  connectorLine: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: '#ddd',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  selectButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
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

export default OrderSelectionScreen;