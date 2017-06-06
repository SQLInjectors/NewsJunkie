import React, { Component } from 'react';
import { sendImpression } from './util';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Image,
  ActivityIndicator
} from 'react-native';
import { Actions } from 'react-native-router-flux';

class Feed extends Component {
  constructor() {
    super();

    this.state = {
      feedContents: [],
      reco_id: ''
    }
    this.getNewsFeed = this.getNewsFeed.bind(this);
    this.getAccountProfile = this.getAccountProfile.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  componentWillMount() {
    this.getNewsFeed();
  }

  getNewsFeed() {
    const accountToken = this.props.token;
    if (accountToken) this.getAccountProfile(accountToken, this.props.profile_id);
  }

  getAccountProfile(token, profile = 'rithy'){
    fetch(`http://raas-se-prod.cognik.us/v1/accounts/hackathon04/profiles/${profile}/recos`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-platform-id': 'phone',
        'x-app-token': `${token}`
      },
      body: JSON.stringify({
        'size': 20
      })
    }).then((response)=> response.json())
      .then((responseJSON) => {
        this.setState({
          feedContents: responseJSON.contents,
          reco_id: responseJSON.reco_id
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  renderShow(item) {
    return () => Actions.show({
      url: item.AP_URL,
      title: item.Title,
      profile_id: this.props.profile_id,
      content_id: item.uid,
      reco_id: this.state.reco_id,
      token: this.props.token,
    });
  }

  renderItem = ({item}) => {
    return (
      <View style={styles.row}>
        <Image source={{uri: item.Image_URL}} style={styles.image} />
        <View style={styles.text} onPress={this.renderShow(item)}>
          <Text style={styles.title}>
            {item.Title}
          </Text>
          <Text >
            By {item.Source}
          </Text>
        </View>
        <View style={styles.text}>
          <Button
            title={'Remove'}
            onPress={() => this.removeItem(item)}
            />
        </View>
      </View>
    )
  }

  removeItem(item){
    let newFeedContents = Array.from(this.state.feedContents);
    let itemIndex = newFeedContents.findIndex((element) => element.uid == item.uid);
    newFeedContents.splice(itemIndex, 1);
    let data = {
      profile_id: this.props.profile_id,
      content_id: item.uid,
      reco_id: this.state.reco_id,
      token: this.props.token,
      type: 'skip',
      percentage_viewed: 0,
      duration_viewed: 0
    };

    sendImpression(data);

    this.setState({
      feedContents: newFeedContents
    });
  }

  render() {
    let flatList;
    const { feedContents } = this.state;

    if (!feedContents.length) {
      return (
        <ActivityIndicator
         animating={true}
         style={[styles.centering, {height: 80}]}
         size="large"
         color='#1D727E'
       />
      )
    }

    const extractKey = ({uid}) => uid
    if(feedContents.length > 0) {
      flatList = <FlatList data={feedContents} renderItem={this.renderItem} keyExtractor={extractKey} />
    }

    return (
      <View style={styles.container}>
          {flatList}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7E8687',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginBottom: 1,
    backgroundColor: '#FFF',
  },
  text: {
    paddingLeft: 15,
  },
  title: {
    width: 225,
    fontWeight: '700'
  },
  image: {
    width: 60,
    height: 60,
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 }
});

export default Feed;
