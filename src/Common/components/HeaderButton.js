import React from "react";
import {Button, Icon} from "@ant-design/react-native";
import {StyleSheet} from "react-native";

const HeaderButton = ({navigation}) => {
    return (
        <Button style={styles.headerButtonStyle}
                onPress={() => navigation.openDrawer()}>
            <Icon style={styles.iconStyle} name="menu"/>
        </Button>)
};

const styles = StyleSheet.create({
    headerButtonStyle: {
        borderColor: 'transparent',
        backgroundColor: 'transparent',
    },
    iconStyle: {
        color: 'black',
    }
});

export default HeaderButton;
