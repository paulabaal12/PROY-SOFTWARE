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
  SafeAreaView,
  StatusBar
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { chatWithName, chatWithRole } = route.params || {};

  const [messages, setMessages] = useState([
    { 
      id: '1', 
      text: '¡Hola! ¿En qué puedo ayudarte?', 
      sender: 'other',
      timestamp: '10:30 AM'
    },
    { 
      id: '2', 
      text: 'Hola, tengo una pregunta sobre mi pedido', 
      sender: 'me',
      timestamp: '10:31 AM'
    },
    { 
      id: '3', 
      text: 'Por supuesto, ¿cuál es tu número de pedido?', 
      sender: 'other',
      timestamp: '10:31 AM'
    },
    { 
      id: '4', 
      text: 'Es el #12345', 
      sender: 'me',
      timestamp: '10:32 AM'
    },
    { 
      id: '5', 
      text: 'Déjame verificar la información...', 
      sender: 'other',
      timestamp: '10:32 AM'
    },
  ]);

  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([newMessage, ...messages]);
    setInputText('');
  };

  const renderMessageItem = ({ item, index }) => {
    const isMe = item.sender === 'me';
    const showAvatar = index === messages.length - 1 || messages[index + 1].sender !== item.sender;

    return (
      <View style={styles.messageRow}>
        {!isMe && showAvatar && (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <FontAwesome5 name="user" size={16} color="#fff" />
            </View>
          </View>
        )}
        {isMe && <View style={styles.spacer} />}
        <View style={[styles.messageContent, isMe ? styles.myMessageContent : styles.otherMessageContent]}>
          <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.otherMessage]}>
            <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
              {item.text}
            </Text>
            <Text style={[styles.timestampText, isMe ? styles.myTimestampText : styles.otherTimestampText]}>
              {item.timestamp}
            </Text>
          </View>
        </View>
        {!isMe && <View style={styles.spacer} />}
      </View>
    );
  };

  if (!chatWithName || !chatWithRole) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <FontAwesome5 name="exclamation-circle" size={50} color="#FF6B6B" />
          <Text style={styles.errorText}>Chat information unavailable</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerAvatar}>
          <FontAwesome5 name="user-circle" size={32} color="#4A90E2" />
        </View>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{chatWithName}</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
        
        <TouchableOpacity style={styles.headerAction}>
          <FontAwesome5 name="phone" size={20} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        inverted
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <FontAwesome5 name="plus" size={20} color="#4A90E2" />
          </TouchableOpacity>
          
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxHeight={100}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity 
            style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : null]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <FontAwesome5 
              name="paper-plane" 
              size={20} 
              color={inputText.trim() ? "#fff" : "#B0B0B0"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerAvatar: {
    marginHorizontal: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerStatus: {
    fontSize: 13,
    color: '#4CAF50',
    marginTop: 2,
  },
  headerAction: {
    padding: 8,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  avatarContainer: {
    width: 36,
    marginRight: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  spacer: {
    width: 44,
  },
  messageContent: {
    flex: 1,
    maxWidth: '80%',
  },
  myMessageContent: {
    alignItems: 'flex-end',
    marginLeft: 'auto',
    marginRight: 4,
  },
  otherMessageContent: {
    alignItems: 'flex-start',
    marginLeft: 4,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '100%',
  },
  myMessage: {
    backgroundColor: '#4A90E2',
    borderBottomRightRadius: 4,
    marginLeft: 50,
    elevation: 1,
  },
  otherMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#333',
  },
  timestampText: {
    fontSize: 12,
    marginTop: 2,
  },
  myTimestampText: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  otherTimestampText: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginRight: 8,
    elevation: 1,
  },
  textInput: {
    fontSize: 16,
    paddingVertical: 10,
    maxHeight: 100,
    color: '#333',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  sendButtonActive: {
    backgroundColor: '#4A90E2',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default ChatScreen;