// src/screens/ContactSellerScreen.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ContactSellerScreen = ({ route }) => {
  const { sellerName, sellerPhone, sellerEmail } = route.params;

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
    </View>
  );
};

const styles = StyleSheet.create({
  // ... define tus estilos aquí
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    fontSize: 18,
    marginLeft: 10,
  },
  contactButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ContactSellerScreen;
