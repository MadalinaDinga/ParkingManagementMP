import React, {Component} from 'react';
import {
    StackNavigator,
    TabNavigator,
    DrawerNavigator,
} from 'react-navigation';
import RequestListScreen from "./src/screens/RequestList";
import CreateRequest from "./src/screens/CreateRequest";
import {Login} from "./src/authentication/Login";
import DetailsRequest from "./src/screens/DetailsRequest";


//used to set up a screen with several tabs
const MainScreenNavigator = TabNavigator({
    'Requests': {screen: RequestListScreen},
    'Create Request': {screen: CreateRequest},
    // 'Login': {screen: Login},
});

//provides a way for your app to transition between screens where each new screen is placed on top of a stack
//when you register a component with a navigator that component will then have a navigation prop added to it.
//this navigation prop drives how we use move between different screens.
const MainApp = StackNavigator({
    Home: {
        screen: Login,
        navigationOptions: ({navigation}) => ({
            title: `Login`,
            path: 'login/',
        }),
    },

    MainScreenNavigator: {
        screen: MainScreenNavigator,
        navigationOptions: {
            title: 'Parking System',
            path: 'mainScreenNavigator/'
        },
    },

    Details: {
        screen: DetailsRequest,
        navigationOptions: ({navigation}) => ({
            title: `View Request`,
            path: 'request/:id',
        }),
    },
});

export default class App extends Component {
    render() {
        return (
            <MainApp/>
        );
    }
}
