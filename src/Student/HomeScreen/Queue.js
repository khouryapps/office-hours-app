import React from "react";
import {View, Text} from 'react-native';
import HeaderButton from "../../Common/components/HeaderButton";


export default class Queue extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Queue',
            headerLeft: () => (
                <HeaderButton navigation={navigation}/>
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
