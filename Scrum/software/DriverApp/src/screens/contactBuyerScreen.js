import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ContactBuyerScreen = ({ route }) => {
  const { buyerName, buyerPhone, buyerEmail } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Contact Buyer: {buyerName}</Text>

      <View style={styles.contactInfo}>
        <FontAwesome name="phone" size={24} color="#1e90ff" />
        <Text style={styles.contactText}>Phone: {buyerPhone}</Text>
      </View>

      <View style={styles.contactInfo}>
        <FontAwesome name="envelope" size={24} color="#1e90ff" />
        <Text style={styles.contactText}>Email: {buyerEmail}</Text>
      </View>

      <TouchableOpacity 
        style={styles.contactButton} 
        onPress={() => console.log('Initiate Call')}
      >
        <Text style={styles.buttonText}>Call Buyer</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.contactButton} 
        onPress={() => console.log('Send Email')}
      >
        <Text style={styles.buttonText}>Email Buyer</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    fontSize: 16,
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

export default ContactBuyerScreen;
