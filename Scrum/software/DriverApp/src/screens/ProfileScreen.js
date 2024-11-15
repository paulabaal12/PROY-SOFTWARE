import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/100');

  useEffect(() => {
    loadSavedImage();
  }, []);

  const loadSavedImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.error('Error loading saved image:', error);
    }
  };


  const saveImage = async (imageUri) => {
    try {
      await AsyncStorage.setItem('profileImage', imageUri);
      setProfileImage(imageUri);
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image');
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to change profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeProfileImage = async () => {
    try {
      await AsyncStorage.removeItem('profileImage');
      setProfileImage('https://via.placeholder.com/100');
      Alert.alert('Success', 'Profile image removed');
    } catch (error) {
      console.error('Error removing image:', error);
      Alert.alert('Error', 'Failed to remove image');
    }
  };

  const handleImageOptions = () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        { text: 'Choose from Gallery', onPress: pickImage },
        { text: 'Remove Picture', onPress: removeProfileImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const profileActions = [
    { icon: 'history', label: 'Order History', onPress: () => navigation.navigate('OrderHistory') },
    { icon: 'cog', label: 'Account Settings', onPress: () => navigation.navigate('AccountSettings') },
    { icon: 'headset', label: 'Support', onPress: () => navigation.navigate('Support') },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileContent}>
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.imageContainer} onPress={handleImageOptions}>
            <Image 
              source={{ uri: profileImage }} 
              style={styles.profileImage}

              onError={() => setProfileImage('https://via.placeholder.com/100')}
            />
            <View style={styles.editIconContainer}>
              <FontAwesome5 name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>johndoe@example.com</Text>
        </View>

        <View style={styles.profileActions}>
          {profileActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionItem}
              onPress={action.onPress}
            >
              <FontAwesome5 name={action.icon} size={20} color="#4A90E2" />
              <Text style={styles.actionText}>{action.label}</Text>
              <FontAwesome5 name="chevron-right" size={16} color="#666" style={styles.actionArrow} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              Alert.alert('Logout', 'Are you sure you want to logout?', [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Logout', 
                  onPress: async () => {
                    try {

                      console.log('Logged Out');
                    } catch (error) {
                      console.error('Error during logout:', error);
                    }
                  } 
                }
              ]);
            }}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomNavBar}>
        {[
          { icon: 'home', label: 'Home', screen: 'Home' },
          { icon: 'truck', label: 'Orders', screen: 'OrderSelection' },
          { icon: 'map', label: 'Map', screen: 'Map' },
          { icon: 'user', label: 'Profile', screen: 'Profile', active: true }
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
  profileContent: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop:25,
    marginBottom: 30,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4A90E2',
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#4A90E2',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  profileActions: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#2C3E50',
    flex: 1,
  },
  actionArrow: {
    marginLeft: 'auto',
  },
  logoutContainer: {
    marginTop: 30,
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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

export default ProfileScreen;