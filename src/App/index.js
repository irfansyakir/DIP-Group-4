import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import {Fragment} from "react";
import {Navigation} from "../Navigation";
import { RadioRoomStack } from '../Navigation';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export const AppContainer = () => {
    return (
        <Fragment>
            <Navigation/>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
    },
});