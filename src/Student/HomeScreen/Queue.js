import React from "react";
import {View, Text} from 'react-native';
import {Button} from "@ant-design/react-native";


export default class Queue extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Queue',
            headerLeft: () => (
                <Button
                    onPress={() => navigation.openDrawer()}>*</Button>
            ),
        }
    };


    render() {
        return (
            <View>
                <Text>This would be the queue</Text>
            </View>
        )
    }
}
