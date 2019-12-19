import React from "react";
import {AsyncStorage, Image, View, Text} from "react-native";
import {NavigationActions} from 'react-navigation';
import {Button, List, SegmentedControl, InputItem, WhiteSpace, WingBlank, Icon} from '@ant-design/react-native'


import {apiFetchStudentCourseList, apiUpdateStudentCourseList} from "../../Common/api";


export default class SideBar extends React.Component {
    state = {
        photo: "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png",
        student_name: null,
        courses_list: [],
        is_ta: true,  // FIXME -- figure out the best way to determine is someone is a ta or not
        edit_courses: false,
        add_course_text: '',
        loading: true,
        fetch_error: null,
    };

    updateStudentCourseList = async (method_type, course_name) => {
        const {data, error} = await apiUpdateStudentCourseList(method_type, course_name)
        this.setState({courses_list: data.courses, error: error})
    }

    async componentDidMount() {
        const {data, error} = await apiFetchStudentCourseList();
        this.setState({courses_list: data.courses, student_name: data.full_name, fetch_error: error, loading: false})
    }


    onValueChange = value => {
        this.props.navigation.navigate(value)

    };

    renderCourses = () => {
        // TODO -- Break out the course rendering part of the sidebar into a smaller function
    }


    render() {
        const {is_ta, courses_list, edit_courses} = this.state
        return (
            <View>
                <StudentInfo student_name={this.state.student_name} photo={this.state.photo}/>
                {is_ta ?
                    <View style={{
                        alignItems: 'center',
                        paddingTop: 20,
                    }}>
                        <SegmentedControl
                            values={['Student', 'TA']}
                            onChange={this.onChange}
                            onValueChange={this.onValueChange}
                            selectedIndex={['Student', 'TA'].indexOf(this.props.activeItemKey)}
                            style={{height: 40, width: 180}}
                        />
                    </View>
                    : null}
                {/*<Text style={{marginTop: 100, alignSelf: 'center'}}>Courses List</Text>*/}
                <List
                    renderHeader={'Courses'}
                    style={{marginTop: 50}}>
                    {courses_list.map((course, index) => {
                        return (
                            <List.Item
                                button
                                key={index}
                                onPress={() => {
                                    AsyncStorage.setItem('last_visited_course_name', course.name);
                                    AsyncStorage.setItem('last_visited_course_id', course.id);
                                    this.props.navigation.navigate('Student', {},
                                        NavigationActions.navigate({
                                            routeName: 'Schedule',
                                            params: {
                                                'course_name': course.name,
                                                'course_id': '' + course.id,
                                            }
                                        }));
                                    this.props.navigation.closeDrawer();
                                }}
                            >
                                {course.name}
                                {edit_courses ? <Icon name="close-circle"
                                                      style={{position: 'absolute', marginLeft: "90%"}}
                                                      onPress={() => {
                                                          this.updateStudentCourseList("DELETE", course.name)
                                                          // TODO -- Add error message if the selected course could not be deleted
                                                      }}/> : null}
                            </List.Item>
                        )
                    })}
                    {edit_courses ?
                        <List.Item>
                            <InputItem
                                clear
                                value={this.state.add_course_text}
                                onChange={value => {
                                    this.setState({
                                        add_course_text: value,
                                    });
                                }}
                                placeholder="e.g. CS 2500"
                            />
                            <Button type="primary"
                                onPress={() => {
                                this.updateStudentCourseList("PATCH", this.state.add_course_text);
                                // TODO -- Add error message if the selected course could not be added
                                this.setState({add_course_text: ''})
                            }}>
                                Add
                            </Button>
                        </List.Item>
                        : null}
                </List>
                <WingBlank>
                <WhiteSpace/>
                <Button
                        onPress={() => {
                            this.setState({edit_courses: !edit_courses})
                        }}>
                    {edit_courses ? "Stop Editing" : "Edit Courses"}
                </Button>

                <WhiteSpace/>
                <Button
                        onPress={() => {
                            this.props.navigation.navigate('Settings')
                        }}>
                    Settings
                </Button>

                <WhiteSpace/>
                <Button type="warning"
                    onPress={() => {
                    AsyncStorage.removeItem('userToken', (err) => {
                        this.props.navigation.navigate('AuthLoading')
                    });
                }}>
                    Log Out
                </Button>
                </WingBlank>
            </View>
        );
    }
};

const StudentInfo = (props) => {

    return (
        <View>
            <Image
                source={{
                    uri:
                    props.photo
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
            }}>{props.student_name}</Text>
        </View>
    )
}