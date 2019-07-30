import React from "react";
import {AsyncStorage, AppRegistry, Image, StatusBar} from "react-native";

import {
    Button,
    Text,
    Container,
    List,
    ListItem,
    Segment,
    Content, Thumbnail,
    Icon
} from "native-base";

const routes = ["", "Chat", "Profile"];
export default class SideBar extends React.Component {
    state = {
        photo: "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png",
        student_name: null,
        courses_list: [],
        isTA: false,
        loading: true,
    };

    fetch_courses_list = async () => {
        try {
            //Assign the promise unresolved first then get the data using the json method.
            const studentAPICall = await fetch('http://127.0.0.1:8002/api/officehours/me/',
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': "Token a891e91d45001088b201b3c2ebe8a5e87a9121f9"
                    },
                    });
            const student_details = await studentAPICall.json()
            this.setState({courses_list: student_details.courses, student_name: student_details.full_name, loading: false});
        } catch(err) {
            console.log("Error fetching data-----------", err);
        }
    }

    async componentDidMount(){
        await this.fetch_courses_list();
        this.setState({isTA: await AsyncStorage.getItem('isTA')})
    }

    render() {
        const {isTA} = this.state
        return (
            <Container>
                <Content>
                    <Thumbnail
                        source={{
                            uri:
                            this.state.photo
                        }}
                        style={{
                            height: 75,
                            width: 75,
                            alignSelf: "center",
                            position: "absolute",
                            top: 80
                        }}
                    />
                    <Text style={{
                        marginTop: 200, alignSelf: 'center', padding: 20, borderColor: 'black',
                        borderWidth: 1, borderRadius: 3
                    }}>{this.state.student_name}</Text>
                    {isTA ?
                    <Segment>
                        <Button first active={this.props.activeItemKey==='StudentHome'}
                                onPress={() => {
                                    this.props.navigation.navigate('Student')
                                }}
                        >
                            <Text>Student</Text>
                        </Button>
                        <Button last active={this.props.activeItemKey==='TAHome'}
                                onPress={() => {
                                    this.props.navigation.navigate('TA')
                                }}
                        >
                            <Text>TA</Text>
                        </Button>
                    </Segment>
                        : null }
                    <Text style={{marginTop: 100, alignSelf: 'center'}}>Courses List</Text>
                    <List
                        dataArray={this.state.courses_list}
                        contentContainerStyle={{marginTop: 50}}
                        renderRow={data => {
                            return (
                                <ListItem
                                    button
                                    onPress={() => this.props.navigation.navigate(data)}
                                >
                                    <Text>{data}</Text>
                                </ListItem>
                            );
                        }}
                    />



                    <Button primary
                            onPress={() => {
                                this.props.navigation.navigate('Settings')
                            }}>
                        <Text>Settings</Text>
                    </Button>
                    <Button danger onPress={() => {
                        AsyncStorage.removeItem('userToken', (err) => {
                            this.props.navigation.navigate('AuthLoading')
                        });
                    }}>
                        <Text>Log Out</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}
