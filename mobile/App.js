/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {AsyncStorage, Platform, StyleSheet, Text, View} from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import HomeScreenWithSidebar from "./src/index.js"
import axios from "axios";
import {BASE_URL} from './src/utils'

import {InputItem, Button} from "@ant-design/react-native"
import Loading from "./src/Common/components/Loading";
import LoginView from "./src/Common/components/LoginView";

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._fetchToken()
    }

    _fetchToken = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            this.props.navigation.navigate(userToken ? 'HomeScreen' : 'Auth')
        } catch (error) {
            this.props.navigation.navigate('Auth')
            console.log('Error fetching token ', error)
        }

    };

    render() {
        return (
        <View style={{paddingTop: '10%'}}>
            <Loading/>
        </View>)
    }
}


// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.

const Root = createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        HomeScreen: HomeScreenWithSidebar,
        Auth: LoginView,
    },
    {
        initialRouteName: 'AuthLoading',
    }
);


const App = createAppContainer(Root);
export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
