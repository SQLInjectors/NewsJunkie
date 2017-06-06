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
  constructor(props) {
    super(props);
    this.state = { canGoBack: false, canGoForward: false };
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onForward = this.onForward.bind(this);
  }

  componentDidMount() {
    Actions.refresh({title: this.props.title});
  }

  onBack() {
    this.refs[WEBVIEW_REF].goBack();
  }

  onForward() {
    this.refs[WEBVIEW_REF].goForward();
  }

  renderNavigationsActions() {
    return <View style={styles.navContainer}>
      <View style={styles.innerNav}>
        <TouchableOpacity
          style={styles.buttonContainer}
          disabled={!this.state.canGoBack}
          onPress={this.onBack}
          >
          <Icon
            style={this.state.canGoBack ? styles.navButton : styles.disabledButton}
            name='arrow-bold-left'>
          </Icon>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer}
          disabled={!this.state.canGoForward}
          onPress={this.onForward}
          >
          <Icon
            style={this.state.canGoForward ? styles.navButton : styles.disabledButton}
            name='arrow-bold-right'>
          </Icon>
        </TouchableOpacity>
      </View>
    </View>;
  }

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      canGoForward: navState.canGoForward
    });
  }

  render() {
    return(
      <View style={styles.container}>
        {this.renderNavigationsActions()}
        <WebView
          onLoad={this.props.onLoad}
          ref={WEBVIEW_REF}
          style={{marginBottom: 45}}
          onNavigationStateChange={this.onNavigationStateChange}
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
  },
  navContainer: {
    height: 40,
    width: '100%'
  },
  innerNav: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    width: '100%'
  },
  disabledButton: {
    fontSize: 34,
    color: '#7E8687',
    opacity: .5,
  },
  navButton: {
    fontSize: 34,
    color: '#1D727E',
  },
  buttonContainer: {
    justifyContent: 'center',
    width: '50%',
    flex: 1,
    alignItems: 'center',
  },
});


export default BrowserView;
