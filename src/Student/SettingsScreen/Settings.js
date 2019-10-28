import React from 'react'
import {View, Text} from "react-native";
import HeaderButton from "../../Common/components/HeaderButton";

export default class Settings extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Settings',
            headerLeft: () => (
                <HeaderButton navigation={navigation}/>
            ),
        }
    };


    render() {
        return (
            <View>
                <Text>This would be the Settings</Text>
            </View>
        )
    }
}