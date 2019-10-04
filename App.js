/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AsyncStorage, Platform, StyleSheet, Text, View} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import HomeScreenRouter from "./src/index.js"
import axios from "axios";
import {BASE_URL} from './src/utils'

import {Button, Container, Content, Form, Header, Input, Item} from "native-base";

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

class SignIn extends React.Component {
    state = {
        username: '',
        password: '',
        login_error: ''
    };

    handle_login = async () => {
        const body = {username: this.state.username, password: this.state.password};
        try {
            const response = await axios.post(BASE_URL + 'rest-auth/login/', body)
            const user_token = response.data.key
            AsyncStorage.setItem('userToken', user_token);
            AsyncStorage.setItem('username', this.state.username);
            this.props.navigation.navigate('App')
        } catch (error) {
            this.setState({login_error: error});
            console.log('Error Logging In: ', error)
        }
    }


    render() {
        return (
            <Container>
                <Header/>
                <Content>
                    <Form>
                        <Item>
                            <Input onChangeText={e => this.setState({username: e})} placeholder="Username"/>
                        </Item>
                        <Item last>
                            <Input secureTextEntry={true} onChangeText={e => this.setState({password: e})}
                                   placeholder="Password"/>
                        </Item>
                        <Button onPress={() => {
                            this.handle_login()
                        }}>
                            <Text>Login</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        );
    }
}

class AuthLoadingScreen
    extends React
        .Component {
    constructor(props) {
        super(props);
        this._fetchToken()
    }

    _fetchToken = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');

            this.props.navigation.navigate(userToken ? 'HomeScreen' : 'Auth')
        } catch (error) {
            console.log('Error fetching token ', error)
        }

    };

    render() {
        return <Text>Loading...</Text>
    }
}


// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.

const Root = createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        HomeScreen: HomeScreenRouter,
        Auth: SignIn,
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
