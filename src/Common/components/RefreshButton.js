import React from 'react'
import {Button, Icon} from "@ant-design/react-native";
import styles from '../../Style'

const RefreshButton = ({navigation}) => {
    return (
        <Button style={styles.headerButtonStyle}
                onPress={navigation.getParam('refreshFetch')}>
            <Icon style={styles.iconStyle} name="reload"/>
        </Button>)
};

export default RefreshButton;
