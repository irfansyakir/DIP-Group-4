import * as React from 'react'
import { Fragment } from 'react'
import { Navigation } from '../Navigation'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'

export const AppContainer = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'light-content'} />
      <Fragment>
        <Navigation />
      </Fragment>
    </SafeAreaProvider>
  )
}
