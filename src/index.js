

import {createSwitchNavigator} from 'react-navigation';
import StudentHomeScreen from './Student/HomeScreen/index.js'
import TAHomeScreen from './TA/index.js'

export default createSwitchNavigator(
    {
        Student: {
            screen: StudentHomeScreen
        },
        TA: {
            screen: TAHomeScreen
        }
    },
    {
        initialRouteName: 'Student'
    }



)