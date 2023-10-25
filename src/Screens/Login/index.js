import { Button } from '@rneui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '../../Store/useAuthStore'
import { useSpotifyAuthenticate } from '../../Utilities/SpotifyApi/useSpotifyAuthenticate'
import { useEffect, useState, useRef } from 'react';
import { GetCurrentUserProfile} from '../../Utilities/SpotifyApi/Utils'

export const Login = () => {
  const changeIsLoggedIn = useAuthStore((state) => state.changeIsLoggedIn)
  const [apiLogin] = useSpotifyAuthenticate()

  // TODO:
  // - add redirect to Spotify Web
  // - pass userId back to app
  // - update userId state => changeUserId(userId)
  // - update isLoggedIn state => changeIsLoggedIn(true)
  // optional: add 'you're being redirected to spotify' page, 'failed login' page

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <Button
        title='Dummy Login'
        onPress={() => changeIsLoggedIn(true)}
        loadingProps={{ size: 'small', color: 'white' }}
        buttonStyle={{
          backgroundColor: 'rgba(111, 202, 186, 1)',
          borderRadius: 5,
        }}
        titleStyle={{ fontWeight: 'bold', fontSize: 23 }}
        containerStyle={{
          marginHorizontal: 100,
          height: 50,
          width: 200,
          marginVertical: 10,
        }}
      />

      <Button
        title='SpotifyLogin'
        onPress={() => {
          apiLogin()
        }}
        loadingProps={{ size: 'small', color: 'white' }}
        buttonStyle={{
          backgroundColor: 'rgba(111, 202, 186, 1)',
          borderRadius: 5,
        }}
        titleStyle={{ fontWeight: 'bold', fontSize: 23 }}
        containerStyle={{
          marginHorizontal: 100,
          height: 50,
          width: 200,
          marginVertical: 10,
        }}
      />
    </SafeAreaView>
  )
}
