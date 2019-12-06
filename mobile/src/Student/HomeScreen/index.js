import React from "react";
import Settings from "../SettingsScreen/index.js";
import {createStackNavigator} from "react-navigation";
import ScheduleHome from "./ScheduleHome";
import QueueScreen from "../QueueScreen/QueueScreen";


export default MainScreenNavigator = createStackNavigator(
    {
        Schedule: {screen: ScheduleHome},
        StudentQueue: {screen: QueueScreen},
        Settings: {screen: Settings},
    },
    {
        defaultNavigationOptions: {
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },

    }
);




