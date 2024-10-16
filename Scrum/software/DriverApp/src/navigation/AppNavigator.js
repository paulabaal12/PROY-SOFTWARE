import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OrderSelectionScreen from '../screens/orderSelectionScreen';
import RouteOptimizationScreen from '../screens/routeOptimizationScreen';
import LocationLoadingScreen from '../screens/locationloadingScreen';
import OrderTrackingScreen from '../screens/orderTrackingScreen';
import FeedbackScreen from '../screens/feedbackScreen';
import MapScreen from '../screens/MapScreen';
import RegisterScreen from '../screens/registrationScreen';
import LoginScreen from '../screens/loginScreen';
import OrderDetailsScreen from '../screens/orderDetailsScreen';
import HomeScreen from '../screens/homeScreen';
import ProfileScreen from '../screens/ProfileScreen'
import ContactBuyerScreen from '../screens/contactBuyerScreen';
import ContactSellerScreen from '../screens/contactSellerScreen';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // Hide headers for all screens
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="OrderSelection" component={OrderSelectionScreen} />
        <Stack.Screen name="ContactSeller" component={ContactSellerScreen}/>
        <Stack.Screen name="ContactBuyer" component={ContactBuyerScreen}/>
        <Stack.Screen name="LocationLoading" component={LocationLoadingScreen} />
        <Stack.Screen name="RouteOptimization" component={RouteOptimizationScreen} />
        <Stack.Screen name='OrderDetails' component={OrderDetailsScreen}/>
        <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="Profile"component={ProfileScreen}/>
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
