import * as firebase from "firebase/app";
import "firebase/database";

let fconfig = {
  apiKey: "API_KEY",
  authDomain: "",
  databaseURL: "",
};
firebase.initializeApp(fconfig);

let database = firebase.database();
export default database;
