// src/screens/ContactSellerScreen.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

const ContactSellerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sellerName, sellerPhone, sellerEmail } = route.params || {};

  if (!sellerName || !sellerPhone || !sellerEmail) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Información del vendedor no disponible.</Text>
      </View>
    );
  }

  const handleCall = () => {
    const phoneNumber = `tel:${sellerPhone}`;
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneNumber);
        } else {
          Alert.alert('Error', 'No se pudo iniciar la llamada.');
        }
      })
      .catch((err) => console.error('Error al iniciar llamada:', err));
  };

  const handleEmail = () => {
    const emailUrl = `mailto:${sellerEmail}`;
    Linking.canOpenURL(emailUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(emailUrl);
        } else {
          Alert.alert('Error', 'No se pudo enviar el correo electrónico.');
        }
      })
      .catch((err) => console.error('Error al enviar correo:', err));
  };

  const handleChat = () => {
    navigation.navigate('Chat', { 
      chatWithName: sellerName,
      chatWithRole: 'Seller',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Contact Seller: {sellerName}</Text>

      <View style={styles.contactInfo}>
        <FontAwesome name="phone" size={24} color="#1e90ff" />
        <Text style={styles.contactText}>Phone: {sellerPhone}</Text>
      </View>

      <View style={styles.contactInfo}>
        <FontAwesome name="envelope" size={24} color="#1e90ff" />
        <Text style={styles.contactText}>Email: {sellerEmail}</Text>
      </View>

      <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
        <Text style={styles.buttonText}>Call Seller</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactButton} onPress={handleEmail}>
        <Text style={styles.buttonText}>Email Seller</Text>
      </TouchableOpacity>

      {/* Botón para Navegar a la Pantalla de Chat */}
      <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
        <FontAwesome name="comments" size={24} color="#fff" />
        <Text style={styles.chatButtonText}>Chat with Seller</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop:35,
    textAlign: 'center',
    color: '#333',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#333',
  },
  contactButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  chatButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ContactSellerScreen;
