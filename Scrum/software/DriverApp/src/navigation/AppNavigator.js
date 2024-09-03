import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OrderSelectionScreen from '../screens/orderSelectionScreen';
import RouteOptimizationScreen from '../screens/routeOptimizationScreen';
import LocationLoadingScreen from '../screens/locationloadingScreen';
import OrderTrackingScreen from '../screens/orderTrackingScreen';
import FeedbackScreen from '../screens/feedbackScreen';
import MapScreen from '../screens/MapScreen'; // Corrected casing

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="OrderSelection">
        <Stack.Screen name="OrderSelection" component={OrderSelectionScreen} options={{ title: 'Select Order' }} />
        <Stack.Screen name="LocationLoading" component={LocationLoadingScreen} options={{ title: 'Loading Location' }} />
        <Stack.Screen name="RouteOptimization" component={RouteOptimizationScreen} options={{ title: 'Optimized Route' }} />
        <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} options={{ title: 'Order Tracking' }} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} options={{ title: 'Feedback' }} />
        <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Map View' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;