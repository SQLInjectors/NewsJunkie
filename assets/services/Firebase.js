import * as Firebase from "firebase"

var config = {
  apiKey: "AIzaSyCrubhJqeyA-f4db9Knz3fRv9-rcE1EMV8",
  authDomain: "chatbot-45848.firebaseapp.com",
  databaseURL: "https://chatbot-45848.firebaseio.com/"
};

const firebaseApp = Firebase.initializeApp(config)

export default firebaseApp;
