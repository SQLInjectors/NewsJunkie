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
import { Actions } from 'react-native-router-flux';

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
    },
    startTime: Date.now(),
    impression: '' };
    this.hideActions = this.hideActions.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.props.onBack = this.componentWillUnmount;
    this.getTimeViewed = this.getTimeViewed.bind(this);
  }

  componentWillUnmount() {
    let data = this.state.data;
    data.duration_viewed = this.getTimeViewed();
    data.type = 'view';
    sendImpression(data);
  }

  getTimeViewed() {
    let timeViewed = Date.now() - this.state.startTime;
    if(!timeViewed) {
      timeViewed = 0;
    }
    return timeViewed;
  }

  hideActions() {
    this.setState({hidden: true});
  }

  handleAction(type) {
    return () => {
      let data = this.state.data;
      data.duration_viewed = this.getTimeViewed();
      data.type = type;
      this.setState({data, impression: type}, () => {
        sendImpression(data);
      });
    };
  }

  renderActions() {
    if(this.state.hidden) {
      return <Text></Text>;
    } else {
      let liked;
      let skipped;
      let styleLike = styles.actions;
      let styleSkip = styles.actions;

      if(this.state.impression === 'like') {
        liked = true;
        styleLike = styles.disabledActions;
      }

      if(this.state.impression === 'skip') {
        skipped = true;
        styleSkip = styles.disabledActions;
      }

      return <View style={styles.actionsContainer}>
        <TouchableOpacity
          disabled={liked}
          onPress={this.handleAction('like').bind(this)} style={styles.actionButtons}>
          <Icon name='thumbs-up' style={styleLike} title='Like'></Icon>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={skipped}
          onPress={this.handleAction('skip').bind(this)} style={styles.actionButtons}>
          <Icon name='thumbs-down' style={styleSkip} title='Dislike'></Icon>
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
  },
  disabledActions: {
    color: '#949494',
    fontSize: 35,
    textAlign: 'center',
    backgroundColor: 'white',
    height: 34,
  }
});

export default ShowPage;
