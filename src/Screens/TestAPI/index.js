import { Text, View } from 'react-native'
import * as React from 'react'
import { Button } from '@rneui/themed'
import {
  GetCurrentUserProfile,
  GetUserPlaylists,
} from '../../Utilities/SpotifyApi/Utils'
import { useAuthStore } from '../../Store/useAuthStore'
import { useNavigation } from '@react-navigation/native'
import {
  user_addToRoom,
  user_getRooms,
  user_removeFromRooms,
  user_removeUser,
} from '../../Utilities/Firebase/user_functions'
import {
  room_getRoom,
  room_removeRoom,
  room_updateRoom,
} from '../../Utilities/Firebase/room_functions'
import {
  message_getMessage,
  message_setMessage,
} from '../../Utilities/Firebase/messages_functions'
import {
  current_track_getCurrentTrack,
  current_track_updateCurrentTrack,
} from '../../Utilities/Firebase/current_track_functions'
import { useEffect, useState } from 'react'
import {
  queue_getQueue,
  queue_updateQueue,
} from '../../Utilities/Firebase/queue_functions'
import { useSpotifyRefresh } from '../../Utilities/SpotifyApi/useSpotifyAuthenticate'
import {
  useIsCurrentTrackPlayingListener,
  useTimeOfLastPlayedListener
} from "../../Utilities/Firebase/useFirebaseListener";

export const TestAPI = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const signOut = useAuthStore((state) => state.signOut)

  const navigation = useNavigation() // Initialize navigation

  const [refresh] = useSpotifyRefresh() //refresh spotify auth token

  // --------------------------------------------------------------------------------------------------> Firebase Listener

  const roomId = '123qweasd'
  const [timeOfLastPlayed] = useTimeOfLastPlayedListener(roomId)
  const [isCurrentTrackPlaying] = useIsCurrentTrackPlayingListener(roomId)

  useEffect(() => {
    console.log('timeOFlAstPlatyed: ', timeOfLastPlayed)
  }, [timeOfLastPlayed])

  useEffect(() => {
    console.log('isCurrentTrackPlaying: ', isCurrentTrackPlaying)
  }, [isCurrentTrackPlaying])
  // --------------------------------------------------------------------------------------------------> Firebase Listener

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
        onPress={() => {
          navigation.navigate('Queue')
        }}
      >
        Go to Queue
      </Button>
      <Button
        onPress={() => {
          navigation.navigate('Playlist')
        }}
      >
        Go to Playlist
      </Button>
      <Button title={'Log Out'} onPress={signOut} />
      <Button
        onPress={() => {
          navigation.navigate('Chatroom')
        }}
      >
        Go to Chatroom
      </Button>

      <Button
        onPress={() => {
          refresh().then()
        }}
      >
        Refresh Token
      </Button>

      <Button
        onPress={() => {
          current_track_updateCurrentTrack({
            roomID: roomId,
            trackId: '123124872365872345',
          })
        }}
      >
        setupCurrentTrack
      </Button>

      <Button
        onPress={() => {
          let count = 0
          let ms = 250
          const interval = setInterval(() => {
            // console.log(count)
            current_track_updateCurrentTrack({
              roomID: roomId,
              timeOfLastPlayed: count,
            })
            if (count >= 2000) {
              clearInterval(interval)
            }
            count = count + ms
          }, ms)
        }}
      >
        setupTimerThing
      </Button>
    </View>
  )
}
