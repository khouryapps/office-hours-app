import TAHomeScreen from "./TAHomeScreen";
import QueueScreen from "../QueueScreen/QueueScreen"
import { createStackNavigator } from "react-navigation";
import Settings from "../../Student/SettingsScreen";
import SideBar from "../../Common/SideBar/SideBar";
import React from "react";


export default TAHomeScreenRouter = createStackNavigator(
    {
        TAHome: { screen: TAHomeScreen },
        TAQueueScreen: {screen: QueueScreen },
        Settings: { screen: Settings },
    },
    {
        contentComponent: props => <SideBar {...props} />
    }
);