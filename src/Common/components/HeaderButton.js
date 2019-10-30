import React from "react";
import {Button, Icon} from "@ant-design/react-native";
import styles from '../../Style'
const HeaderButton = ({navigation}) => {
    return (
        <Button style={styles.headerButtonStyle}
                onPress={() => navigation.openDrawer()}>
            <Icon style={styles.iconStyle} name="menu"/>
        </Button>)
};

export default HeaderButton;
