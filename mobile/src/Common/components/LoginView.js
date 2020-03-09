import React from "react";
import axios from "axios";
import {BASE_URL} from "../../utils";
import {AsyncStorage, Text, View} from "react-native";
import {Button, InputItem} from "@ant-design/react-native";

class LoginView extends React.Component {
    state = {
        username: '',
        password: '',
        login_error: ''
    };

    handle_login = async () => {
        const body = {username: this.state.username, password: this.state.password};
        try {
            const response = await axios.post(BASE_URL + 'rest-auth/login/', body);
            const user_token = response.data.key;
            AsyncStorage.setItem('userToken', user_token);
            AsyncStorage.setItem('username', this.state.username);
            this.props.navigation.navigate('HomeScreen')
        } catch (error) {
            this.setState({login_error: error});
            console.log('Error Logging In: ', error)
        }
    };


    render() {
        return (
            <View style={{
                marginTop: 'auto',
                marginBottom: 'auto',
                paddingLeft: '10%',
                paddingRight: '10%'
            }}>
                <View>
                    <Text style={{textAlign: 'center', fontSize: 50, fontWeight: 'bold', marginBottom: '20%'}}>
                        Khoury Office Hours
                    </Text>
                    <Text style={{textAlign: 'center', marginBottom: '10%'}}>
                        Use your CCIS credentials to log in
                    </Text>
                </View>
                <InputItem
                    clear
                    value={this.state.username}
                    onChange={value => {
                        this.setState({
                            username: value,
                        });
                    }}
                    placeholder="Username"
                    autoCapitalize={'none'}
                />
                <InputItem
                    type="password"
                    value={this.state.password}
                    onChange={value => {
                        this.setState({
                            password: value,
                        });
                    }}
                    placeholder="Password"
                />
                <Button type="primary" onPress={() => {
                    this.handle_login()
                }} style={{
                    marginTop: '10%'
                }}>
                    <Text>Login</Text>
                </Button>
            </View>
        );
    }
}

export default LoginView;