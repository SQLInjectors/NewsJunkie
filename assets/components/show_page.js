import React, { Component } from 'react';
import BrowserView from './browser_view';
import {
  View,
  TouchableOpacity,
  Button,
  StyleSheet,
  Text
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { sendImpression } from './util.js';

class ShowPage extends Component {
  constructor(props) {
    super(props);
    this.state = { hidden: false, data: {
      duration_viewed: "",
      profile_id: this.props.profile_id,
      content_id: this.props.content_id,
      reco_id: this.props.reco_id,
      token: this.props.token,
      percentage_viewed: 100
    } };
    this.hideActions = this.hideActions.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.props.onBack = this.componentWillUnmount;
    debugger
  }

  onLoad() {
    this.setState({startTime: Date.now()});
  }


  componentWillUnmount() {
    const viewTime = Date.now() - this.state.startTime;
    // if(viewTime < x) action('bounce')
    this.handleAction('view');
  }

  getTimeViewed() {
    return Date.now() - this.state.startTime;
  }

  hideActions() {
    this.setState({hidden: true});
  }

  handleAction(type) {
    return () => {
      let data = this.state.data;
      data.duration_viewed = this.getTimeViewed();
      data.type = type;
      this.setState({data}, () => {
        sendImpression(data);
      });
    };
  }

  renderActions() {
    if(this.state.hidden) {
      return <Text></Text>;
    } else {
      return <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={this.handleAction('like').bind(this)} style={styles.actionButtons}>
          <Icon name='thumbs-up' style={styles.actions} title='Like'></Icon>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.handleAction('skip').bind(this)} style={styles.actionButtons}>
          <Icon name='thumbs-down' style={styles.actions} title='Dislike'></Icon>
        </TouchableOpacity>
      </View>;
    }
  }

  render() {
    return(
      <View onPress={this.hideActions} style={styles.container}>
        <BrowserView onLoad={this.onLoad} url={this.props.url} title={this.props.title}/>
        {this.renderActions()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 63,
  },
  navigation: {
    height: 10,
    flex: 1,
    flexDirection: 'row'
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#dddddd'
  },
  actionButtons: {
    width: '50%',
    height: 40,
  },
  actions: {
    color: '#1D727E',
    fontSize: 35,
    textAlign: 'center',
    backgroundColor: 'white',
    height: 34,
  }
});

export default ShowPage;
