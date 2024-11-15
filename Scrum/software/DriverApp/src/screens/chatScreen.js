// src/screens/ChatScreen.js

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  Image 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Extraer los parámetros pasados desde la pantalla de contacto
  const { chatWithName, chatWithRole } = route.params || {};

  // Estado para manejar los mensajes y el texto de entrada
  const [messages, setMessages] = useState([
    { id: '1', text: '¡Hola!', sender: 'other' },
    { id: '2', text: '¡Hola! ¿Cómo estás?', sender: 'me' },
    { id: '3', text: 'Estoy bien, gracias. ¿Y tú?', sender: 'other' },
  ]);

  const [inputText, setInputText] = useState('');

  // Manejar el envío de mensajes
  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: (messages.length + 1).toString(),
      text: inputText,
      sender: 'me',
    };

    setMessages([newMessage, ...messages]);
    setInputText('');
  };

  // Renderizar cada mensaje
  const renderMessageItem = ({ item }) => {
    const isMe = item.sender === 'me';
    return (
      <View 
        style={[
          styles.messageBubble, 
          isMe ? styles.myMessage : styles.otherMessage
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  // Verificar si los parámetros existen
  if (!chatWithName || !chatWithRole) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Información de chat no disponible.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      {/* Header de la Pantalla de Chat */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#1e90ff" />
        </TouchableOpacity>
        {/* Avatar del Chat Partner */}
        <Image 
          source={require('../images/user.png')} // Reemplaza con la ruta de tu avatar
          style={styles.avatar}
        />
        <Text style={styles.headerTitle}>{chatWithName}</Text>
      </View>

      {/* Lista de Mensajes */}
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        inverted
      />

      {/* Área de Entrada de Mensaje */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Escribe un mensaje..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <FontAwesome name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    // Mover el header más abajo
    marginTop: 25,
  },
  backButton: {
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    marginLeft:5,

    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#1e90ff', // Color de fondo en caso de que no haya imagen
  },
  headerTitle: {
    fontSize: 19,
    marginLeft:5,
    fontWeight: 'bold',
    color: '#333',
  },
messagesContainer: {
  padding: 10,
  flexGrow: 1,
  justifyContent: 'flex-end',
  paddingBottom: 10, // Ajusta o elimina según sea necesario
},

  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: '#1e90ff',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  otherMessage: {
    backgroundColor: '#a9acb0',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
inputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 5,
  borderTopWidth: 1,
  borderTopColor: '#ddd',
  marginBottom:0,
  backgroundColor: '#fff',
  paddingVertical: 5, // Reduce el padding vertical
},
  textInput: {
    flex: 1,
    maxHeight: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginBottom:0,
    fontSize: 16,
    color: '#333',
    marginRight: 10, // Espacio entre el input y el botón
  },
  sendButton: {
    backgroundColor: '#1e90ff',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // Centrar el botón
    alignSelf: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ChatScreen;
