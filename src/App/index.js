import * as React from 'react'
import { Text } from 'react-native';
import { Fragment } from 'react'
import { Navigation } from '../Navigation'
import * as Linking from 'expo-linking';
import { NavigationContainer } from '@react-navigation/native';
import {makeRedirectUri} from "expo-auth-session";

const prefix = [Linking.createURL('/'), 'exp://', 'radioroom://'];

export const AppContainer = () => {
    const linking = {
        // prefix: [],
        prefixes: prefix,
        config: {
            /* configuration for matching screens with paths */
        },
    };
    const redirectUri = makeRedirectUri({
        scheme: 'radioroom',
        path: 'redirect'
    });

    console.log(redirectUri)
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Navigation />
    </NavigationContainer>
    //   <Fragment>
    //       <Navigation/>
    //   </Fragment>
  )
}
