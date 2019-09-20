import React, { Component } from "react";
import Settings from "../SettingsScreen/index.js";
import SideBar from "../SideBar/SideBar.js";
import { createDrawerNavigator, createBottomTabNavigator} from "react-navigation";
import ScheduleHome from "./ScheduleHome";
import Queue from "./Queue";
import {Button, Footer, FooterTab, Icon, Text} from "native-base";

const MainScreenNavigator = createBottomTabNavigator(
    {
        Schedule: {screen: ScheduleHome},
        Queue: {screen: Queue}
    },
    {
        tabBarPosition: 'bottom',
        tabBarComponent: props => {
            return(
                <Footer>
                    <FooterTab>
                        <Button light
                                onPress = {() => props.navigation.navigate("Schedule")}>
                            <Icon name='calendar'/>
                            <Text>Schedule</Text>
                        </Button>
                        <Button light
                                onPress={() => props.navigation.navigate("Queue")}>
                            <Icon name='clock'/>
                            <Text>Queue</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            )

        }
    },
    {
        initialRouteName: 'Schedule'
    }
);

export default HomeScreenRouter = createDrawerNavigator(
  {
    StudentHome: { screen: MainScreenNavigator },
    ScheduleHome: { screen: ScheduleHome},
    Settings: { screen: Settings },
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);




