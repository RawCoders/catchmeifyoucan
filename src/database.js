/* global process */

import * as firebase from "firebase/app";
import "firebase/database";

let fconfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  databaseURL: `https://${process.env.FIREBASE_DB}.firebaseio.com`,
};
firebase.initializeApp(fconfig);

let database = firebase.database();
export default database;
