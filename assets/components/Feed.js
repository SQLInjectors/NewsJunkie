import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Image,
  ActivityIndicator
} from 'react-native';

class Feed extends Component {
  constructor() {
    super();

    this.state = {
      accountToken: 'TpHTuVSY4VP3Wi7Ic24K4w==',
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
    const { accountToken } = this.state;
    if (accountToken) this.getAccountProfile(accountToken);
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
    }).then ((response)=> response.json())
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

  renderItem = ({item}) => {
    return (
      <View style={styles.row}>
        <Image source={{uri: item.Image_URL}} style={styles.image} />
        <View style={styles.text}>
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
            onPress={() => this.removeItem(item.uid)}
            />
        </View>
      </View>
    )
  }

  removeItem(id){
    let newFeedContents = Array.from(this.state.feedContents);
    let itemIndex = newFeedContents.findIndex((element) => element.uid == id);
    newFeedContents.splice(itemIndex, 1);

    this.setState({
      feedContents: newFeedContents
    });
  }

  render() {
    let flatList;
    const { accountToken, feedContents } = this.state;

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
