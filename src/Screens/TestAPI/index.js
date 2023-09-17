import { Text, View } from 'react-native'
import * as React from 'react'
import { Button } from '@rneui/themed'
import {
  GetCurrentUserProfile,
  GetUserPlaylists,
} from '../../Utilities/SpotifyApi/Utils'
import { useAuthStore } from '../../Store/useAuthStore'

export const TestAPI = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const signOut = useAuthStore((state) => state.signOut)

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>TestAPI</Text>
      <Button
        title='Get Playlists'
        onPress={() => {
          GetCurrentUserProfile({ accessToken: accessToken }).then((res) => {
            console.log(res.id)
            GetUserPlaylists({
              accessToken: accessToken,
              userId: res.id,
              limit: 8,
            }).then((res) => {
              console.log(res)
            })
          })
        }}
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
        title={'Log Out'}
        onPress={() => signOut()}
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
      ></Button>
    </View>
  )
}
