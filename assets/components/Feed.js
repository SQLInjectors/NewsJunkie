import React, { Component } from 'react';
import { sendImpression } from './util';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  LayoutAnimation
} from 'react-native';
import { Actions } from 'react-native-router-flux';

class Feed extends Component {
  constructor() {
    super();

    this.state = {
      feedContents: [],
      reco_id: '',
      bubbleShow: false,
      bubbleText: "Get more news?",
      animating: true
    }
    this.getNewsFeed = this.getNewsFeed.bind(this);
    this.getAccountProfile = this.getAccountProfile.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.showTextBubble = this.showTextBubble.bind(this);
  }

  componentWillMount() {
    this.getNewsFeed();
  }

  getNewsFeed() {
    console.log("getting more news")
    const accountToken = this.props.token;

    if (accountToken) {
        this.setState({bubbleShow: false, animating: true},
          () => this.getAccountProfile(accountToken, this.props.profile_id))
    }
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
          reco_id: responseJSON.reco_id,
          bubbleShow: false,
          animating: false
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  renderShow(item) {
    item.viewed = true;
    Actions.show({
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
        <TouchableOpacity style={styles.text} onPress={() => this.renderShow(item)}>
          <Text style={styles.title}>
            {item.Title}
          </Text>
          <Text >
            By {item.Source}
          </Text>
        </TouchableOpacity>
        <View style={styles.trashWrapper}>
          <TouchableOpacity onPress={() => this.removeItem(item)}>
            <Image source={require('../images/trash.png')} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  showTextBubble(){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({bubbleShow: true})
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
      percentage_viewed: 1,
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

    if (this.state.animating) {
      return (
        <ActivityIndicator
         animating={true}
         style={[styles.centering, {height: 80}]}
         size="large"
         color='#1D727E'
       />
      )
    }


    const filteredContents = [];
    const extractKey = ({uid}) => uid
    if(feedContents.length > 0) {

      for(let i = 0; i < feedContents.length; i++) {
        let signal = true;
        for(let j = 0; j < filteredContents.length; j++) {
          if(filteredContents[j].Title === feedContents[i].Title) signal = false;
        }

        if(signal) filteredContents.push(feedContents[i]);
      }

      flatList = <FlatList
        data={filteredContents}
        renderItem={this.renderItem}
        keyExtractor={extractKey}
        onEndReached={() => this.showTextBubble()}
        onEndReachedThreshold={0.2}/>
    }

    const chatBubbleContainerStyle = this.state.bubbleShow ? styles.textBubble : {display: "none"}

    return (
      <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Here's todays news!</Text>
          </View>

          {flatList}


          <Image
            onPress={this.getNewsFeed}
            style={styles.avatar}
            source={require('../images/shiba.png')}
            />
          <View style={chatBubbleContainerStyle}>
              <Image
                style={styles.chatBubble}
                source={require('../images/chatbubble.png')}
                />
              <Text style={styles.textInBubble}>{this.state.bubbleText}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={this.getNewsFeed}
                    >
                    <Text style={styles.buttonText}>YES</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.setState({bubbleShow: false})}
                    >
                  <Text style={styles.buttonText}>NO</Text>
                  </TouchableOpacity>
                </View>

            </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAFA6',
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
 },
 header: {
   marginTop: 25,
   alignSelf: "center",
   marginBottom: 10
 },
 headerText: {
   fontSize: 18,
   fontWeight: "bold",
   color: "white"
 },
 avatar: {
   width: 50,
   height: 50,
   zIndex: 10,
   position: "absolute",
   right: 10,
   bottom: 5
 },
 trashWrapper: {
   width: 100,
   height: 50,
   justifyContent: 'center',
   alignItems: 'center',
 },
 chatBubble: {
   width: 130,
   height: 120,
   zIndex: 11,
   position: "absolute",
   right: -15,
   bottom: -30
 },
 textBubble: {
   width: 99,
   height: 78,
   zIndex: 10,
   position: "absolute",
   right: 34,
   bottom: 60,
   backgroundColor: "white",
   borderRadius: 10
 },
 textInBubble: {
   padding: 6,
   textAlign: "center",
   fontWeight: "bold"
 },
 button: {
   zIndex: 14,
   fontSize: 10,
   backgroundColor: "transparent"
 },
 buttonContainer: {
   flexDirection: "row",
   justifyContent: "space-around",
   paddingRight: 1,
   zIndex: 13
 },
 buttonText: {
   color: "grey",
   fontWeight: "bold"
 }
});

export default Feed;
