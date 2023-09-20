import * as React from 'react'
import { useEffect } from 'react'
import { Text } from 'react-native'
import { Navigation } from '../Navigation'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import * as Linking from 'expo-linking'
import { NavigationContainer } from '@react-navigation/native'

const prefix = [Linking.createURL('/'), 'exp://', 'radioroom://']

export const AppContainer = () => {
  const linking = {
    prefix: prefix,
    // prefixes: prefix,
    config: {
      /* configuration for matching screens with paths */
    },
  }
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'light-content'} />
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <Navigation />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
