import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import axios from 'axios'; // Add Axios for API requests

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post('http://your-backend-url.com/api/register', { email, password });
      if (response.data.success) {
        Alert.alert("Registration Successful", "You can now log in.");
        navigation.navigate("Login");
      } else {
        Alert.alert("Registration Failed", response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", error.response ? error.response.data.message : "An error occurred");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../images/delivery.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Create an Account</Text>

      <TextInput
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        placeholderTextColor="#666"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#666"
      />

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#666"
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
        <Text style={styles.loginButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.signUpText}>
        Already have an account?{" "}
        <Text style={styles.signUpLink} onPress={() => navigation.navigate("Login")}>
          Log In
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  image: {
    width: 250,
    height: 250,
    alignSelf: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#f5f5f5",
  },
  loginButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  signUpText: {
    textAlign: "center",
    color: "#7d7d7d",
  },
  signUpLink: {
    color: "#1e90ff",
    fontWeight: "bold",
  },
});

export default RegisterScreen;
