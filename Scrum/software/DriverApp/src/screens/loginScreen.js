import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const handleLogin = async () => {
        try {
          const response = await axios.post('http://your-meteor-backend-url.com/api/login', { email, password });
          const { success, message } = response.data;
    
          if (success) {
            Alert.alert("Login Successful!", message);
            // Navigate to dashboard or other protected route
          } else {
            Alert.alert("Login Failed", message);
          }
        } catch (error) {
          Alert.alert("Error", error.response ? error.response.data.message : error.message);
        }
      };
    
  
    return (
      <View style={styles.container}>
        <Image
          source={require("../images/delivery.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Log into your account to continue</Text>
  
        <TextInput
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#666"
          keyboardType="email-address"
        />
  
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#666"
        />
  
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
  
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
  
        <Text style={styles.signUpText}>
          Don't have an account?{" "}
          <Text
            style={styles.signUpLink}
            onPress={() => navigation.navigate("Register")}
          >
            Sign Up
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
      justifyContent: "top",
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
      marginTop: 10,
    },
    subtitle: {
      fontSize: 16,
      color: "#7d7d7d",
      textAlign: "center",
      marginBottom: 30,
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
    forgotPassword: {
      color: "#1e90ff",
      textAlign: "right",
      marginBottom: 20,
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
  
  export default LoginScreen;