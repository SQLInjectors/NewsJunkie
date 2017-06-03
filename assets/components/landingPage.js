import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class LandingPage extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>This is the landing page</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 600,
    width: 400,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LandingPage;
