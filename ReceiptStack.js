import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RequestScreen from './RequestScreen'
import NewReceipt from './NewReceipt'

const stackNav = createStackNavigator();

export function ReceiptStack() {
    return(
        <NavigationContainer independent={true}>
            <stackNav.Navigator initialRouteName='Manual Receipt'>
            <stackNav.Screen name='Manual Receipt' component={NewReceipt}/>
            <stackNav.Screen name='Split' component={RequestScreen}/>
            </stackNav.Navigator>
        </NavigationContainer>
    )
}