import React, { Component } from "react";
import HomeScreen from "./StudentHomeScreen.js";
import Settings from "../SettingsScreen/index.js";
import SideBar from "../SideBar/SideBar.js";
import { createDrawerNavigator, createBottomTabNavigator} from "react-navigation";
import Schedule from "./StudentHomeScreen";
import Queue from "./Queue";
import {Button, Footer, FooterTab, Icon, Text} from "native-base";

const MainScreenNavigator = createBottomTabNavigator(
    {
        Schedule: {screen: Schedule},
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
    }
);

export default HomeScreenRouter = createDrawerNavigator(
  {
    StudentHome: { screen: MainScreenNavigator },
    Schedule: { screen: Schedule},
    Settings: { screen: Settings },
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);




