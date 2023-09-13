import { TextInput } from 'react-native'
import { Button } from '@rneui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'
import {useEffect, useState} from 'react'
import { useAuthStore } from '../../Store/useAuthStore'
import SpotifyApiAuth, {Api} from "../../Utilities/SpotifyApiAuth";

export const Login = () => {
    const [userId, setUserId] = useState('')
    //const [loading, setLoading] = useState(false)
    const changeUserId = useAuthStore((state) => state.changeUserId)
    const changeIsLoggedIn = useAuthStore((state) => state.changeIsLoggedIn)

    const changeCode = useAuthStore((state) => state.changeCode)
    const changeCodeVerifier = useAuthStore((state) => state.changeCodeVerifier)
    const changeAccessToken = useAuthStore((state) => state.changeAccessToken)
    const changeRefreshToken = useAuthStore((state) => state.changeRefreshToken)

    const [apiLogin] = SpotifyApiAuth()

    // TODO:
    // - add redirect to Spotify Web
    // - pass userId back to app
    // - update userId state => changeUserId(userId)
    // - update isLoggedIn state => changeIsLoggedIn(true)
    // optional: add 'you're being redirected to spotify' page, 'failed login' page

    const handleLogin = () => {
        if (userId.length !== 0) {
          changeUserId(userId)
          changeIsLoggedIn(true)
        }
        changeUserId(userId)
        changeIsLoggedIn(true)
    }

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <TextInput
        style={{
          height: 40,
          width: 300,
          margin: 12,
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
        }}
        onChangeText={setUserId}
        value={userId}
        placeholder='Enter UserID'
      />
      <Button
        title='Dummy Login'
        onPress={handleLogin}
        // loading={loading}
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
                changeIsLoggedIn(true)
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
