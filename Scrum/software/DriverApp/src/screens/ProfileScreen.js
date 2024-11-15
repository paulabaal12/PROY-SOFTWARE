import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileEmail}>johndoe@example.com</Text>
      </View>

      {/* Profile Actions */}
      <View style={styles.profileActions}>
        <TouchableOpacity 
          style={styles.actionItem} 
          onPress={() => navigation.navigate('OrderHistory')}
        >
          <FontAwesome name="history" size={24} color="#1e90ff" />
          <Text style={styles.actionText}>Order History</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionItem} 
          onPress={() => navigation.navigate('AccountSettings')}
        >
          <FontAwesome name="cog" size={24} color="#1e90ff" />
          <Text style={styles.actionText}>Account Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionItem} 
          onPress={() => navigation.navigate('Support')}
        >
          <FontAwesome name="life-ring" size={24} color="#1e90ff" />
          <Text style={styles.actionText}>Support</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={() => console.log('Logged Out')}
        >
          <Text style={styles.logoutText}>Log Out</Text>
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
  profileHeader: {
    alignItems: 'center',
    marginTop:25,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
  },
  profileActions: {
    marginTop: 30,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  actionText: {
    fontSize: 18,
    marginLeft: 10,
  },
  logoutContainer: {
    marginTop: 'auto',
  },
  logoutButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
