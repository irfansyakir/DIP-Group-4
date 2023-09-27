import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from '@expo/vector-icons/Ionicons'

import { Home } from '../Screens/Home'
import { Search, SearchClick } from '../Screens/Search'
import { RadioRooms } from '../Screens/RadioRooms'
import { Profile } from '../Screens/Profile'
import { EditProfile } from '../Screens/Profile/EditProfile'
import { Login } from '../Screens/Login'

import { Fragment } from 'react'
import { useAuthStore } from '../Store/useAuthStore'
import { Playlist } from '../Screens/Playlist'
import { TestAPI } from '../Screens/TestAPI'
import { COLORS, SIZES } from '../Constants'
import { CurrentlyPlaying } from '../Commons/UI/currentlyPlaying'
import { Queue } from '../Screens/Queue'
import { Chatroom } from '../Screens/Chatroom'

// Track
import { Track } from '../Commons/Track/track'
import { CreateRoom } from '../Screens/RadioRooms/createroom'

const Stack = createNativeStackNavigator()
const ProfileStack = createNativeStackNavigator()
const SearchStack = createNativeStackNavigator()

const Tab = createBottomTabNavigator()

// Navigation after user LOG IN
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName

          // Determine the iconName based on the route name
          if (route.name === 'Home') {
            iconName = 'ios-home'
          } else if (route.name === 'Search') {
            iconName = 'ios-search'
          } else if (route.name === 'RadioRooms') {
            iconName = 'ios-folder'
          } else if (route.name === 'Profile') {
            iconName = 'ios-person'
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={focused ? COLORS.primary : COLORS.grey}
            />
          )
        },
        tabBarInactiveTintColor: COLORS.grey,
        tabBarActiveTintColor: COLORS.primary,
        tabBarStyle: {
          backgroundColor: COLORS.dark,
          paddingVertical: SIZES.small,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: 'InterMedium',
        },
      })}
    >
      <Tab.Screen name='Home' component={Home} />
      <Tab.Screen name='Search' component={SearchStackNavigator} />
      <Tab.Screen name='RadioRooms' component={RadioRooms} />
      <Tab.Screen name='Profile' component={ProfileStackNavigator} />
      <Tab.Screen name='TestAPI' component={TestAPI} />
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

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name='ProfileTab' component={Profile} />
      <ProfileStack.Screen name='EditProfile' component={EditProfile} />
      <ProfileStack.Screen name='Track' component={Track} />
      <ProfileStack.Screen name='CreateRoom' component={CreateRoom} />
    </ProfileStack.Navigator>
  )
}

function SearchStackNavigator(){
  return(
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name='SearchTab' component={Search} />
      <SearchStack.Screen name="SearchClick" component={SearchClick} />
      <SearchStack.Screen name='Track' component={Track} />
    </SearchStack.Navigator>
  )
}

export const Navigation = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const wholeState = useAuthStore((state) => state)
  console.log(wholeState)

  return (
    <React.Fragment>
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerShown: false,
        }}
      >
        {isLoggedIn ? (
          <Fragment>
            <Stack.Screen name='RootHome' component={HomeTabs} />
            <Stack.Screen name='EditProfile' component={EditProfile} />
            <Stack.Screen name='Queue' component={Queue} />
            <Stack.Screen name='Playlist' component={Playlist} />
            <Stack.Screen name='Chatroom' component={Chatroom} />
            <Stack.Screen name='CreateRoom' component={CreateRoom} />
          </Fragment>
        ) : (
          <Stack.Screen name='Auth' component={AuthStack} />
        )}
      </Stack.Navigator>
      {false && (
        <CurrentlyPlaying
          coverUrl={
            'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228'
          }
          title='Never Not'
          artist={'Lauv'}
          currentTime={30}
          duration={100}
        />
      )}
    </React.Fragment>
  )
}
