import React from "react";
import {StyleSheet, Text} from "react-native";
import {Button} from "@ant-design/react-native";

const Loading = () => {
        return <Button disabled style={styles.loadingButtonStyle} loading><Text style={{color: 'black'}}>Loading</Text></Button>
};

const styles = StyleSheet.create({
    loadingButtonStyle: {
        borderColor: 'transparent',
        backgroundColor: 'transparent',
    },
});

export default Loading;
