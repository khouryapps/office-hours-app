

import {createSwitchNavigator} from 'react-navigation';
import HomeScreenRouter from './Student/HomeScreen/index.js'
import TAHomeScreen from './TA/HomeScreen/index.js'


export default createSwitchNavigator(
    {
        Student: {
            screen: HomeScreenRouter
        },
        TA: {
            screen: TAHomeScreen
        }
    },
    {
        initialRouteName: 'Student'
    }



)