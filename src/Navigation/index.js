import { NavigationContainer } from '@react-navigation/native'
import * as React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { Home } from '../Screens/Home'
import { Search } from '../Screens/Search'
import { RadioRooms } from '../Screens/RadioRooms'
import { Profile } from '../Screens/Profile'
import { Login } from '../Screens/Login'
import { useAuthStore } from '../Store/useAuthStore'
import {Fragment} from "react";

const Stack = createNativeStackNavigator()

const Tab = createBottomTabNavigator()

// Navigation after user LOG IN
function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={Home} />
      <Tab.Screen name='Search' component={Search} />
      <Tab.Screen name='RadioRooms' component={RadioRooms} />
      <Tab.Screen name='Profile' component={Profile} />
    </Tab.Navigator>
  )
}

// Navigation before user LOG IN
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' component={Login} />
    </Stack.Navigator>
  )
}

export const Navigation = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  return (
    <Fragment>
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerShown: false,
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen name='RootHome' component={HomeTabs} />
        ) : (
          <Stack.Screen name='Auth' component={AuthStack} />
        )}
      </Stack.Navigator>
    </Fragment>
  )
}
