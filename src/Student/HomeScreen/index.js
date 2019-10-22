import React from "react";
import Settings from "../SettingsScreen/index.js";
import SideBar from "../../Common/SideBar/SideBar";
import {createDrawerNavigator, createStackNavigator} from "react-navigation";
import ScheduleHome from "./ScheduleHome";
import Queue from "./Queue";


const MainScreenNavigator = createStackNavigator(
    {
        Schedule: {screen: ScheduleHome},
        Queue: {screen: Queue}
    },
    {
        defaultNavigationOptions: {
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    }
);


const SettingsStack = createStackNavigator(
    {
        Settings: {
            screen: Settings,
        }
    },
    {
        navigationOptions: ({ navigation }) => ({
            initialRouteName: 'Setting',
            headerMode: 'screen',
            headerTitle: 'Settings',
            drawerLabel: 'Settings',
        }),
    }
);

export default HomeScreenRouter = createDrawerNavigator(
  {
    StudentHome: {
        name: MainScreenNavigator,
        screen: MainScreenNavigator },
    Settings: {
        name: 'SettingsStack',
        screen: SettingsStack
    },

  },
  {
    contentComponent: props => <SideBar {...props} />
  },
);




