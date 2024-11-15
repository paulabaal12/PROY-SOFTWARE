import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking, SafeAreaView, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

const ContactSellerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sellerName, sellerPhone, sellerEmail } = route.params || {};

  if (!sellerName || !sellerPhone || !sellerEmail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <FontAwesome5 name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.errorText}>Seller information not available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${sellerPhone}`).catch(err => 
      Alert.alert('Error', 'Could not initiate call')
    );
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${sellerEmail}`).catch(err => 
      Alert.alert('Error', 'Could not open email client')
    );
  };

  const handleChat = () => {
    navigation.navigate('Chat', { 
      chatWithName: sellerName,
      chatWithRole: 'Seller',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Seller</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.sellerCard}>
          <View style={styles.avatarContainer}>
            <FontAwesome5 name="user-circle" size={60} color="#4A90E2" />
            <Text style={styles.sellerName}>{sellerName}</Text>
          </View>

          <View style={styles.contactInfoContainer}>
            <TouchableOpacity style={styles.contactInfoRow} onPress={handleCall}>
              <View style={[styles.iconContainer, { backgroundColor: '#4A90E2' }]}>
                <FontAwesome5 name="phone-alt" size={20} color="#fff" />
              </View>
              <Text style={styles.contactText}>{sellerPhone}</Text>
              <FontAwesome5 name="chevron-right" size={16} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactInfoRow} onPress={handleEmail}>
              <View style={[styles.iconContainer, { backgroundColor: '#50C878' }]}>
                <FontAwesome5 name="envelope" size={20} color="#fff" />
              </View>
              <Text style={styles.contactText}>{sellerEmail}</Text>
              <FontAwesome5 name="chevron-right" size={16} color="#999" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
            <FontAwesome5 name="comments" size={20} color="#fff" />
            <Text style={styles.chatButtonText}>Start Chat</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomNavBar}>
        {[
          { icon: 'home', label: 'Home', screen: 'Home' },
          { icon: 'box', label: 'Orders', screen: 'OrderSelection' },
          { icon: 'map-marker-alt', label: 'Map', screen: 'Map' },
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
              color={item.screen === 'Home' ? '#4A90E2' : '#666'} 
            />
            <Text style={[
              styles.navText,
              item.screen === 'Home' && styles.activeNavText
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginRight: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sellerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sellerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  contactInfoContainer: {
    marginBottom: 20,
  },
  contactInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  contactText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  chatButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  errorText: {
    flex: 1,
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginRight: 40,
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
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

export default ContactSellerScreen;