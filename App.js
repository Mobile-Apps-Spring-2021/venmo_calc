import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import NewReceipt from './NewReceipt'
import Contacts from './Contacts'
import History from './History'
import Scan from './ScanScreen'

const Tab = createBottomTabNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Manual Receipt') {
            iconName = 'receipt-outline'
          } else if (route.name === 'Contacts') {
            iconName = 'book-outline';
          } else if (route.name === 'History') {
            iconName = 'save-outline';
          } else if (route.name === 'Scan') {
            iconName = 'camera-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'purple',
        inactiveTintColor: 'gray',
      }}
    >
        <Tab.Screen name="Scan" children = { () => (<Scan/>)}/>
        <Tab.Screen name="Manual Receipt" children = { () => (<NewReceipt/>)}/>
        <Tab.Screen name="Contacts" children = { () => (<Contacts/>)}/>
        <Tab.Screen name="History" children = { () => (<History/>)}/>
      </Tab.Navigator>
      </NavigationContainer>
  );
}

