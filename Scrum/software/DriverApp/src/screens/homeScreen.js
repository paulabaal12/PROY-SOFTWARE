import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const availableOrders = [
    { id: '1', customer: 'John Doe', location: '123 Main St', orderDetails: '2 packages', eta: '30 min' },
    { id: '2', customer: 'Jane Smith', location: '456 Elm St', orderDetails: '1 package', eta: '45 min' },
    { id: '3', customer: 'John Doe', location: '123 Main St', orderDetails: '2 packages', eta: '20 min' },
    { id: '4', customer: 'Jane Smith', location: '456 Elm St', orderDetails: '1 package', eta: '35 min' },
  ];

  const actions = [
    { id: '1', title: 'Track Orders', icon: 'route', screen: 'OrderSelection', color: '#4A90E2' },
    { id: '2', title: 'Contact Seller', icon: 'headset', screen: 'ContactSeller', color: '#50C878' },
    { id: '3', title: 'Contact Buyer', icon: 'user-friends', screen: 'ContactBuyer', color: '#FF6B6B' },
    { id: '4', title: 'Order History', icon: 'history', screen: 'OrderHistory', color: '#9B59B6' },
  ];

  const handleSelectOrder = async (order) => {
    try {
      console.log(`Selected order ${order.id}`);
      const placeholderResponse = { available: true };
      
      if (placeholderResponse.available) {
        navigation.navigate('OrderDetails', { 
          orderId: order.id,
          customer: order.customer,
          location: order.location,
          orderDetails: order.orderDetails
        });
      } else {
        alert('Order is no longer available');
      }
    } catch (error) {
      console.error('Error validating order:', error);
      alert('Error validating order, please try again later.');
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Orders</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slideshow}>
        {availableOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <FontAwesome5 name="box" size={20} color="#4A90E2" />
              <Text style={styles.etaText}>ETA: {order.eta}</Text>
            </View>
            <View style={styles.orderInfo}>
              <View style={styles.orderRow}>
                <FontAwesome5 name="user" size={14} color="#666" />
                <Text style={styles.orderText}>{order.customer}</Text>
              </View>
              <View style={styles.orderRow}>
                <FontAwesome5 name="map-marker-alt" size={14} color="#666" />
                <Text style={styles.orderText}>{order.location}</Text>
              </View>
              <View style={styles.orderRow}>
                <FontAwesome5 name="box-open" size={14} color="#666" />
                <Text style={styles.orderText}>{order.orderDetails}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.selectButton} 
              onPress={() => handleSelectOrder(order)}
            >
              <Text style={styles.selectButtonText}>Start Delivery</Text>
              <FontAwesome5 name="arrow-right" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Action Cards Section */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <FlatList
        data={actions}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.actionCard, { borderLeftColor: item.color }]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.color + '20' }]}>
              <FontAwesome5 name={item.icon} size={24} color={item.color} />
            </View>
            <Text style={styles.actionTitle}>{item.title}</Text>
            <FontAwesome5 name="chevron-right" size={14} color="#999" style={styles.actionArrow} />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.actionRow}
      />

      <View style={styles.bottomNavBar}>
        {[
          { icon: 'home', label: 'Home', screen: 'Home', active: true },
          { icon: 'truck', label: 'Orders', screen: 'OrderSelection' },
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
  slideshow: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginRight: 15,
    width: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  etaText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  orderInfo: {
    marginBottom: 15,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderText: {
    fontSize: 15,
    color: '#444',
    marginLeft: 10,
  },
  selectButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    paddingHorizontal: 20,
    color: '#2C3E50',
  },
  actionRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  actionCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    width: '48%',
    marginBottom: 15,
    borderLeftWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  actionArrow: {
    position: 'absolute',
    right: 15,
    top: 15,
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

export default HomeScreen;