import TAHomeScreen from "./TAHomeScreen";
import QueueScreen from "../QueueScreen/QueueScreen"
import { createDrawerNavigator } from "react-navigation";
import Settings from "../../Student/SettingsScreen";
import SideBar from "../../Student/SideBar/SideBar";
import React from "react";


export default TAHomeScreenRouter = createDrawerNavigator(
    {
        TAHome: { screen: TAHomeScreen },
        TAQueueScreen: {screen: QueueScreen },
        Settings: { screen: Settings },
    },
    {
        contentComponent: props => <SideBar {...props} />
    }
);