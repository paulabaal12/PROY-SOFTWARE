// src/screens/DeliveryScreen.js

import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const DeliveryScreen = ({ pickupLocation, deliveryLocation }) => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulating data loading
    const loadData = async () => {
      // Your data loading logic here
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading || !pickupLocation || !deliveryLocation) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Your main content here */}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default DeliveryScreen;
