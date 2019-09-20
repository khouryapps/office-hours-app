import React from "react";
import {AsyncStorage, AppRegistry, Image, StatusBar} from "react-native";
import {
    Button,
    Text,
    Input,
    Container,
    List,
    ListItem,
    Segment,
    Content, Thumbnail,
    Icon
} from "native-base";
import {fetchStudentCourseList} from "../api";

export default class SideBar extends React.Component {
    state = {
        photo: "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png",
        student_name: null,
        courses_list: [],
        isTA: false,
        edit_courses: false,
        add_course_text: '',
        loading: true,
    };

    updateCourseList = async (method_type, course_name) => {
        console.log("update course list")
        try {
            const apiCall = await fetch('http://127.0.0.1:8002/api/officehours/courses/',
                {
                    method: method_type,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': "Token a891e91d45001088b201b3c2ebe8a5e87a9121f9"
                    },
                    body: JSON.stringify({
                        course: course_name,
                    }),
                });
            const new_student_details = await apiCall.json()
            this.setState({courses_list: new_student_details.courses})
        } catch (err) {
            console.log("Error Updating Course List: ", err)
        }
    }

    async componentDidMount(){
        const data = await fetchStudentCourseList();
        this.setState({courses_list: data.courses, student_name: data.full_name, loading: false})
        this.setState({isTA: await AsyncStorage.getItem('isTA')})
    }

    render() {
        const {isTA, courses_list, edit_courses} = this.state
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
                        contentContainerStyle={{marginTop: 50}}>
                        {courses_list.map((course, index) => {
                            return (
                                <ListItem
                                    button
                                    key={index}
                                    onPress={() => {
                                        // AsyncStorage.setItem('last_visited_course_name', course.name);
                                        // AsyncStorage.setItem('last_visited_course_id', course.id);
                                        this.props.navigation.navigate('ScheduleHome', {'course_name': course.name, 'course_id': course.id});
                                        this.props.navigation.closeDrawer();
                                    }
                                    }
                                >
                                    <Text>{course.name}</Text>
                                    {edit_courses ? <Text style={{textAlign: 'right'}}
                                                          onPress={() => {
                                                              console.log("remove course", course)
                                                              this.updateCourseList("DELETE", course)
                                                          }}>  (X)</Text> : null}
                                </ListItem>
                            )
                        })}
                        {edit_courses ?
                            <ListItem>

                                <Input placeholder={"e.g. CS 2500"}
                                       onChangeText={(add_course_text) => this.setState({add_course_text})}
                                       value={this.state.add_course_text}/>
                                <Button onPress={() => {this.updateCourseList("PATCH", this.state.add_course_text);
                                this.setState({add_course_text: ''})}}>
                                <Text>Add</Text>
                                </Button>
                                </ListItem>
                            : null}
                    </List>

                    <Button primary
                            onPress={() => {
                                this.setState({edit_courses: !edit_courses})
                            }}>
                        <Text>{edit_courses ? "Stop Editing" : "Edit Courses"}</Text>
                    </Button>


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
