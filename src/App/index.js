import * as React from 'react'
import { Fragment } from 'react'
import { Navigation } from '../Navigation'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export const AppContainer = () => {
  return (
    <SafeAreaProvider>
      <Fragment>
        <Navigation />
      </Fragment>
    </SafeAreaProvider>
  )
}
