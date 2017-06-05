import Expo from 'expo';
import React from 'react';
import { Router, Scene } from 'react-native-router-flux';
import { StyleSheet, Text, View } from 'react-native';
import LandingPage from './assets/components/landingPage';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="landingPage" component={LandingPage} initial={true} />
        </Scene>
      </Router>
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
