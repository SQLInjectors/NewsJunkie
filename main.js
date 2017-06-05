import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LandingPage from './assets/components/landingPage';

class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <LandingPage/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  }

});

Expo.registerRootComponent(App);
