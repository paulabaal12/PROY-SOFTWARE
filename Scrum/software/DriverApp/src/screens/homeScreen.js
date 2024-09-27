import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  
  // Mock data for available orders
  const availableOrders = [
    { id: '1', customer: 'John Doe', location: '123 Main St', orderDetails: '2 packages' },
    { id: '2', customer: 'Jane Smith', location: '456 Elm St', orderDetails: '1 package' },
    { id: '3', customer: 'Bob Johnson', location: '789 Pine St', orderDetails: '3 packages' },
  ];

  const actions = [
    { id: '1', title: 'Track Orders', icon: 'truck', screen: 'OrderTracking' },
    { id: '2', title: 'Find Courier', icon: 'motorcycle', screen: 'Courier' },
    { id: '3', title: 'View Feedback', icon: 'comments', screen: 'Feedback' },
    { id: '4', title: 'Notifications', icon: 'bell', screen: 'Notifications' },
  ];

  const [selectedOrder, setSelectedOrder] = useState(null);

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderText}>Customer: {item.customer}</Text>
      <Text style={styles.orderText}>Location: {item.location}</Text>
      <Text style={styles.orderText}>Order: {item.orderDetails}</Text>
      <TouchableOpacity 
        style={styles.selectButton} 
        onPress={() => setSelectedOrder(item)}
      >
        <Text style={styles.selectButtonText}>Select Order</Text>
      </TouchableOpacity>
    </View>
  );

  const renderActionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.actionCard}
      onPress={() => navigation.navigate(item.screen)}
    >
      <FontAwesome name={item.icon} size={40} color="#fcbf49" />
      <Text style={styles.actionTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Slideshow of Available Orders */}
      <Text style={styles.headerTitle}>Available Orders</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slideshow}>
        {availableOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <Text style={styles.orderText}>Customer: {order.customer}</Text>
            <Text style={styles.orderText}>Location: {order.location}</Text>
            <Text style={styles.orderText}>Order: {order.orderDetails}</Text>
            <TouchableOpacity 
              style={styles.selectButton} 
              onPress={() => setSelectedOrder(order)}
            >
              <Text style={styles.selectButtonText}>Select Order</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Action Cards Section */}
      <Text style={styles.sectionTitle}>Actions</Text>
      <FlatList
        data={actions}
        renderItem={renderActionItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.actionRow}
      />

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <FontAwesome name="home" size={24} color="#1e90ff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('OrderTracking')}>
          <FontAwesome name="truck" size={24} color="#666" />
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Map')}>
          <FontAwesome name="map" size={24} color="#666" />
          <Text style={styles.navText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <FontAwesome name="user" size={24} color="#666" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  slideshow: {
    marginBottom: 20,
  },
  orderCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginRight: 10,
    width: 250,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 10,
  },
  selectButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  actionRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
  },
  navText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default HomeScreen;
