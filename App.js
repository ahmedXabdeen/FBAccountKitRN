/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View, Button, Alert} from 'react-native';
import RNAccountKit from 'react-native-facebook-account-kit'
import axios from "axios";


export default class App extends Component {
  componentDidMount(){
    RNAccountKit.configure({
      responseType: 'code',
      defaultCountry: 'SD',
      initialPhoneCountryPrefix: '+249',

    })
  }

  startAuth(){
    RNAccountKit.loginWithPhone()
      .then(async (response) => {
        if (!response) {
          console.log('Login cancelled')
        } else {
          this.getAccessToken(response.code)
        }
      })
  }

  getAccessToken(auth_code){

    /*
      the access_token parameter at the end is the compination of your Facebook App ID and the Accounk Kit App Secret.

      it should be like this "AA|<Facebook_App_ID>|<Account_Kit_App_Secret>" 
    */
    axios.get(`https://graph.accountkit.com/v1.3/access_token?grant_type=authorization_code&code=${auth_code}&access_token=AA|299493574308913|cecdb73e36482c7c331668b6392edb42`)
    .then((response) => {
      this.getPhone(response.data.access_token)
    })
    .catch((e) => console.log(e))
  }

  getPhone(token){

    // make sure to disable "Require App Secret" in your Facebook App settings for this to work
    axios.get(`https://graph.accountkit.com/v1.3/me/?access_token=${token}`)
    .then((response) => {

      // this is the full phone number, e.g. +249912300000
      const { number } = response.data.phone
      console.warn(number)
      Alert.alert("Phone", number)
    })
    .catch((e) => console.log(e))
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Login"
          onPress={()=>this.startAuth()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
