import {View, Text, Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

export const Home = ({navigation}) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
            {/*<Button*/}
            {/*    title="Go to Details"*/}
            {/*    onPress={() => navigation.navigate('Details')}*/}
            {/*/>*/}
        </View>
    );
}


