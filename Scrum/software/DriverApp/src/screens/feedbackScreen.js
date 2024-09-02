// src/screens/FeedbackScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const FeedbackScreen = ({ navigation, route }) => {
  const { orderId } = route.params;
  const [rating, setRating] = useState('');
  const [comments, setComments] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Feedback for Order ID: {orderId}</Text>
      <TextInput
        style={styles.input}
        placeholder="Rating (1-5)"
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
      />
      <TextInput
        style={styles.input}
        placeholder="Comments"
        value={comments}
        onChangeText={setComments}
      />
      <Button title="Submit" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default FeedbackScreen;
