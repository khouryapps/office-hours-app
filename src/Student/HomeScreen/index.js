import React from "react";
import Settings from "../SettingsScreen/index.js";
import {createStackNavigator} from "react-navigation";
import ScheduleHome from "./ScheduleHome";
import Queue from "./Queue";


export default MainScreenNavigator = createStackNavigator(
    {
        Schedule: {screen: ScheduleHome},
        Queue: {screen: Queue},
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




