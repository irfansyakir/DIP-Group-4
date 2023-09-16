import * as React from 'react'
import { Text } from 'react-native';
import { Navigation } from '../Navigation'
import * as Linking from 'expo-linking';
import { NavigationContainer } from '@react-navigation/native';


const prefix = [Linking.createURL('/'), 'exp://', 'radioroom://'];

export const AppContainer = () => {
    const linking = {
        prefix: prefix,
        // prefixes: prefix,
        config: {
            /* configuration for matching screens with paths */
        },
    };

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Navigation />
    </NavigationContainer>
  )
}
