

import {createDrawerNavigator} from 'react-navigation';
import StudentHomeScreenRouter from './Student/HomeScreen/index.js'
import TAHomeScreenRouter from './TA/HomeScreen/index.js'
import SideBar from "./Common/SideBar/SideBar";
import React from "react";

const HomeScreenWithSidebar = createDrawerNavigator(
    {
        Student: {
            screen: StudentHomeScreenRouter
        },
        TA: {
            screen: TAHomeScreenRouter
        }
    },{
        contentComponent: props => <SideBar {...props} />,
        initialRouteName: 'TA',
    },

);

export default HomeScreenWithSidebar;