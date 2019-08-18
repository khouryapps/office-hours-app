

import {createSwitchNavigator, createDrawerNavigator} from 'react-navigation';
import StudentHomeScreenRouter from './Student/HomeScreen/index.js'
import TAHomeScreenRouter from './TA/HomeScreen/index.js'

const HomeScreenRouter = createSwitchNavigator(
    {
        Student: {
            screen: StudentHomeScreenRouter
        },
        TA: {
            screen: TAHomeScreenRouter
        }
    },
    {
        initialRouteName: 'Student'
    }
)


export default HomeScreenRouter;