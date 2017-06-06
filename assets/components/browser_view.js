import React, { Component } from 'react';
import {
  WebView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Entypo';

class BrowserView extends Component {

  componentDidMount() {
    Actions.refresh({title: this.props.title});
  }


  render() {
    return(
      <View style={styles.container}>
        <WebView
          onLoad={this.props.onLoad}
          ref={WEBVIEW_REF}
          style={{marginBottom: 45}}
          source={{uri: this.props.url}}>
        </WebView>
      </View>
    );
  }
}

const WEBVIEW_REF = 'WEBVIEW_REF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});


export default BrowserView;
