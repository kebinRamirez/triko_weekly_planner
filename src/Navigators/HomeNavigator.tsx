import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from "../Views/Home";

const Stack = createStackNavigator();

const HomeNavigator = () =>{
    const {Navigator, Screen} = Stack;

    return(
        <Navigator headerMode="none" initialRouteName="Home">
            <Screen name="Home" component={Home} />
        </Navigator>
    );
}

export default HomeNavigator;