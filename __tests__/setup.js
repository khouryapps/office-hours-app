//setup.js

global.fetch = require('jest-fetch-mock');


jest.mock('Linking', () => {
    return {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        openURL: jest.fn(),
        canOpenURL: jest.fn(),
        getInitialURL: jest.fn(),
    }
});

jest.mock('react-navigation', () => {
    return {
        createAppContainer: jest.fn().mockReturnValue(function NavigationContainer(props) {return null;}),
        createDrawerNavigator: jest.fn(),
        createMaterialTopTabNavigator: jest.fn(),
        createStackNavigator: jest.fn(),
        createSwitchNavigator: jest.fn(),
        createBottomTabNavigator: jest.fn(),
        StackActions: {
            push: jest.fn().mockImplementation(x => ({...x,  "type": "Navigation/PUSH"})),
            replace: jest.fn().mockImplementation(x => ({...x,  "type": "Navigation/REPLACE"})),
        },
        NavigationActions: {
            navigate: jest.fn().mockImplementation(x => x),
        }
    }
});

jest.mock('DatePickerIOS', () => 'DatePickerIOS');


