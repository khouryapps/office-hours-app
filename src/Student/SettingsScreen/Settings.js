import React from 'react'
import {View, Text} from "react-native";
import {Button} from "@ant-design/react-native";

export default class Settings extends React.Component {
    static navigationOptions = {
        title: 'Settings',
        headerLeft: () => (
            <Button
                onPress={() => navigation.openDrawer()}>*</Button>
        ),
    };


    render() {
        return (
            <View>
                <Text>This would be the Settings</Text>
            </View>
        )
    }
}