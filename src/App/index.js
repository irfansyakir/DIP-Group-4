import * as React from 'react'
import { useEffect } from 'react'
import { Text } from 'react-native'
import { Navigation } from '../Navigation'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import * as Linking from 'expo-linking'
import { NavigationContainer } from '@react-navigation/native'
import { GetCurrentUserProfile } from '../Utilities/SpotifyApi/Utils'
import { useAuthStore } from '../Store/useAuthStore'
import { useProfileStore } from '../Store/useProfileStore'

const prefix = [Linking.createURL('/'), 'exp://', 'radioroom://']

export const AppContainer = () => {
  const changeDisplayName = useProfileStore((state) => state.changeDisplayName)
  const changeEmail = useProfileStore((state) => state.changeEmail)
  const changeFollowers = useProfileStore((state) => state.changeFollowers)
  const changeProfileUrl = useProfileStore((state) => state.changeProfileUrl)
  const accessToken = useAuthStore((state) => state.accessToken)
  const linking = {
    prefix: prefix,
    // prefixes: prefix,
    config: {
      /* configuration for matching screens with paths */
    },
  }

  useEffect(() => {
    getInitialProfileData()
  }, [])

  const getInitialProfileData = async () => {
    // fetch data on load
    try {
      const profileData = await GetCurrentUserProfile({
        accessToken: accessToken,
      })
      changeDisplayName(profileData.display_name)
      changeEmail(profileData.email)
      changeFollowers(profileData.followers.total)
      changeProfileUrl(profileData.images[1].url)
    } catch (error) {
      console.error(error)
    }
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
