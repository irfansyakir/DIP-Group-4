import {NavigationContainer} from "@react-navigation/native";
import * as React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

import {Home} from "../Screens/Home";
import {Search} from "../Screens/Search";
import {RadioRooms} from "../Screens/RadioRooms";
import {Profile} from "../Screens/Profile";
import {Login} from "../Screens/Login";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
function HomeTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Search" component={Search} />
            <Tab.Screen name="RadioRooms" component={RadioRooms} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}
export const Navigation = () => {
    return(
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerBackTitleVisible: false,
                    headerBackVisible: false
                }}
            >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="RootHome" component={HomeTabs} />
            </Stack.Navigator>
        </NavigationContainer>

    )
}

