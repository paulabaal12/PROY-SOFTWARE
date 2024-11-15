// src/screens/SupportScreen.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SupportScreen = () => {
  const navigation = useNavigation();

  // Estados para el formulario de contacto
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Función para regresar a la pantalla anterior
  const goBack = () => {
    navigation.goBack();
  };

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    if (!subject || !message) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    // Aquí se llamaría a una función del backend para enviar el mensaje
    // Por ahora, simplemente mostramos una alerta de éxito
    Alert.alert('Éxito', 'Tu mensaje ha sido enviado al soporte.');

    // Limpiar los campos
    setSubject('');
    setMessage('');
  };

  // Preguntas Frecuentes de ejemplo
  const faqs = [
    {
      question: '¿Cómo puedo rastrear mi pedido?',
      answer: 'Puedes rastrear tu pedido en la sección de "Track Orders" dentro de la aplicación.',
    },
    {
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Ve a "Account Settings" y selecciona "Change Password" para actualizar tu contraseña.',
    },
    {
      question: '¿Qué hacer si mi pedido está retrasado?',
      answer: 'Por favor, contacta al soporte a través de esta pantalla para asistencia inmediata.',
    },
    // Agrega más preguntas según sea necesario
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color="#1e90ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
        <View style={{ width: 40 }} /> {/* Espaciador para centrar el título */}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Sección de Preguntas Frecuentes */}
        <View style={styles.faqContainer}>
          <Text style={styles.sectionTitle}>FAQs</Text>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            </View>
          ))}
        </View>

        {/* Sección de Contacto */}
        <View style={styles.contactContainer}>
          <Text style={styles.sectionTitle}>Contact Support</Text>

          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter subject"
            value={subject}
            onChangeText={setSubject}
          />

          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter your message"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    marginTop:25,

    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: StatusBar.currentHeight || 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    paddingBottom: 20,
  },
  faqContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  faqItem: {
    marginBottom: 15,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e90ff',
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    paddingLeft: 10,
  },
  contactContainer: {
    marginTop: 30,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top', // Para alinear el texto en la parte superior en Android
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SupportScreen;
