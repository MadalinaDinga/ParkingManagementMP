import React, {Component} from 'react';
import {StackNavigator} from 'react-navigation';
import {TabNavigator} from "react-navigation";
import RequestListScreen from "./src/screens/RequestList";
import CreateRequest from "./src/screens/CreateRequest";


const MainScreenNavigator = TabNavigator({
    'Requests': {screen: RequestListScreen},
    'Create Request': {screen: CreateRequest},
});

const MainApp = StackNavigator({
    Home: {
        screen: MainScreenNavigator,
        navigationOptions: {
            title: 'Parking System',
        },
    },
});

export default class App extends Component {
    render() {
        return <MainApp/>;
    }
}