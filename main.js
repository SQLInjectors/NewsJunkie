import Expo from 'expo';
import React from 'react';
import { Router, Scene } from 'react-native-router-flux';
import { StyleSheet, Text, View } from 'react-native';
import LandingPage from './assets/components/landingPage';
import Feed from './assets/components/Feed';
import Show from './assets/components/show_page';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="landingPage" component={LandingPage} initial={true} hideNavBar={true}/>
          <Scene key='feed' component={Feed} title='News Feed' hideNavBar={true}/>
          <Scene key='show' component={Show} title='Article' hideNavBar={false} />
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
