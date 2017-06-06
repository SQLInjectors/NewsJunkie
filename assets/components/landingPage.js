import React from 'react';
import { StyleSheet,
         Text,
         View,
         TextInput,
         TouchableOpacity,
         Button,
         Image,
         KeyboardAvoidingView} from 'react-native';
import firebaseApp from '../services/Firebase';
import { Actions } from 'react-native-router-flux';

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: null,
      email: null,
      password: null,
      formType: "Log In",
      accountToken: "",
      profile_id: "",
      profile_details: null
    };
    this.getAccountKey = this.getAccountKey.bind(this);
    this.getAccountKey2 = this.getAccountKey2.bind(this);
    this.registerProfile = this.registerProfile.bind(this);
    this.submitInfo = this.submitInfo.bind(this);
    this.getAllProfiles = this.getAllProfiles.bind(this);
  }

  getAccountKey(){
    return fetch('http://raas-se-prod.cognik.us/v1/login/hackathon04', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-platform-id': 'phone',
        'Host': 'raas-se-prod.cognik.us'
      },
      body: JSON.stringify({
        'app_id': 'SE_rDW4TUCC8a',
        'password': '3gcZpU6hd2'
      })
    }).then ((response)=> response.json())
      .then((responseJSON) => {
        console.log(responseJSON.token);
        this.setState({
          accountToken: responseJSON.token
        })
      }).then(() => this.getAllProfiles())
      .catch((error) => {
        console.log(error);
      })
  }

  getAccountKey2(){

    fetch('http://raas-se-prod.cognik.us/v1/login/hackathon04', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-platform-id': 'phone',
        'Host': 'raas-se-prod.cognik.us'
      },
      body: JSON.stringify({
        'app_id': 'SE_rDW4TUCC8a',
        'password': '3gcZpU6hd2'
      })
    }).then ((response)=> response.json())
      .then((responseJSON) => {
        this.setState({
          accountToken: responseJSON.token
        })
      }).then(() => Actions.feed({
        profile_id: this.state.profile_id,
        token: this.state.accountToken
      }))
      .catch((error) => {
        console.log(error);
      })
  }

  getAllProfiles(){

    return fetch(`http://raas-se-prod.cognik.us/v1/accounts/hackathon04/profiles`, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-platform-id': 'phone',
        'Host': 'raas-se-prod.cognik.us',
        'x-app-token': this.state.accountToken
      }
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        console.log(responseJSON);
        if (responseJSON.size <= 4){
          return true
        } else {
          console.log("Reached COGNIK account limit!")
          return false
        }
      })
  }

  registerProfile(){
    fetch(`http://raas-se-prod.cognik.us/v1/accounts/hackathon04/profiles/${this.state.profile_id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-platform-id': 'phone',
        'x-app-token': this.state.accountToken
      },
      body: JSON.stringify({})
    }).then ((response)=> response.json())
      .then((responseJSON) => {
        () => Actions.feed({
          profile_id: this.state.profile_id,
          token: this.state.accountToken
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  submitInfo() {
    // SUBMIT REQUEST TO BACKEND AND PASS USER INFO ALONG
    // USER TOKEN && ACCOUNT TOKEN

    if (this.state.formType === 'Sign Up'){
      this.getAccountKey().then((response) => {
        if (response){
          firebaseApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then((response) => {
            console.log("Sign up successful")
            this.setState({profile_id: response.uid})
            this.getAccountKey()
          })
          .catch(function(error){
           var errorCode = error.code
           var errorMessage = error.message;
           console.log(errorMessage)
          })
        }
      })
    } else if (this.state.formType === 'Log In'){
      firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((response) => {
        console.log("Log in successful")
        this.setState({profile_id: response.uid})
        this.getAccountKey2()
        //REDIRECT TO FEED
      })
      .catch(function(error) {

      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage)
      });
    }

  }

  onChange(field, value) {
    this.setState({
      [field]: value
    });
  }

  formType() {
    if (this.state.formType === 'Log In') {
      return(
        <View style={styles.container1}>
            <View style={styles.authView}>
              <Image style={styles.icons} source={require('../images/email.png')} />
              <TextInput
                value={this.props.value}
                placeholder="email"
                keyboardType="email-address"
                blurOnSubmit={false}
                returnKeyType="done"
                style={styles.input}
                autoCapitalize="none"
                onChangeText={(value) => this.onChange("email", value)}
                />
            </View>

            <View style={styles.authView}>
              <Image style={styles.icons} source={require('../images/lock.png')} />
              <TextInput
                value={this.props.value}
                placeholder="password"
                blurOnSubmit={false}
                returnKeyType="done"
                style={styles.input}
                secureTextEntry={true}
                onChangeText={(value) => this.onChange("password", value)}
                />
            </View>
          </View>
      );
    } else {
      return(
        <View style={styles.container1}>

        <View style={styles.authView}>
          <Image style={styles.icons} source={require('../images/person.png')} />
          <TextInput
            value={this.props.value}
            placeholder="full name"
            secureTextEntry={false}
            blurOnSubmit={false}
            returnKeyType="done"
            style={styles.input}
            onChangeText={(value) => this.onChange("password", value)}
            onSubmitEditing={this.props.onAddItem}
            />
        </View>

            <View style={styles.authView}>
              <Image style={styles.icons} source={require('../images/email.png')} />
              <TextInput
                value={this.props.value}
                placeholder="email"
                keyboardType="email-address"
                secureTextEntry={false}
                blurOnSubmit={false}
                returnKeyType="done"
                style={styles.input}
                autoCapitalize="none"
                onChangeText={(value) => this.onChange("email", value)}
                onSubmitEditing={this.props.onAddItem}
                />
            </View>

            <View style={styles.authView}>
              <Image style={styles.icons} source={require('../images/lock.png')} />
              <TextInput
                value={this.props.value}
                placeholder="password"
                secureTextEntry={true}
                blurOnSubmit={false}
                returnKeyType="done"
                style={styles.input}
                onChangeText={(value) => this.onChange("password", value)}
                onSubmitEditing={this.props.onAddItem}
                />
            </View>
          </View>
      );
    }
  }


  render() {
    const authForm = this.formType();
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.welcome}>
          <Text style={styles.title}>Welcome To News Junkie</Text>
          <Text style={styles.tagline}>For personalized content at your fingertips</Text>
        </View>
        <Image style={styles.newsImage} source={require('../images/news.png')} />
          <View style={styles.authWrapper}>
            <View style={styles.formType}>
              <Button
                title="Log In"
                color="#1D727E"
                onPress={() => this.setState({formType: 'Log In'})}
                />
              <Button
                title="Sign Up"
                color="#1D727E"
                onPress={() => this.setState({formType: 'Sign Up'})}
                />
            </View>
              {authForm}
            <TouchableOpacity style={styles.buttonWrapper} onPress={() => this.submitInfo()}>
              <Text style={styles.buttonText}>{this.state.formType}</Text>
            </TouchableOpacity>
          </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    backgroundColor: '#4CAFA6',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
  },
  title: {
    width: 400,
    height: 35,
    fontSize: 30,
    color: 'white',
    marginBottom: 10,
    marginTop: 50,
    textAlign: 'center',
  },
  formType: {
    flexDirection: 'row',
    height: 40,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  newsImage: {
    marginBottom: 10,
    marginTop: 40,
  },
  tagline: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',

  },
  buttonWrapper: {
    backgroundColor: '#1D727E',
    width: 250,
    height: 35,
    marginTop: 10,
    padding: 5,
    borderRadius: 10,
    marginLeft: 30,
    borderWidth: 2,
    borderColor: '#d6d7da',
  },
  authWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  welcome: {
    flexDirection: 'column',
    height: 50,
    marginBottom: 50,
  },
  container1: {
    maxHeight: 200,
    width: 400,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    width: 250,
    height: 35,
    marginTop: 5,
    padding: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d6d7da',
  },
  authView: {
    height: 50,
    width: 400,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  icons: {
    marginRight: 10,
  },
  button: {
    color: 'white',
    width: 60,
    height: 90,
  }
});

export default LandingPage;
