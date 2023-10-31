import { Button } from '@rneui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '../../Store/useAuthStore'
import { useQueueStore } from '../../Store/useQueueStore'
import { useSpotifyAuthenticate } from '../../Utilities/SpotifyApi/useSpotifyAuthenticate'
import { useEffect, useState, useRef } from 'react';
import { GetCurrentUserProfile} from '../../Utilities/SpotifyApi/Utils'
import { GetQueue} from '../../Utilities/SpotifyApi/Utils'
import {
  userQueue_getQueue,
  userQueue_updateQueue,
} from '../../Utilities/Firebase/user_queue_functions'

export const Login = () => {
  const changeIsLoggedIn = useAuthStore((state) => state.changeIsLoggedIn)
  const [apiLogin] = useSpotifyAuthenticate()

  const accessToken = useAuthStore((state) => state.accessToken)
  const userId = useAuthStore((state) => state.userId)
  const changeQueue = useQueueStore((state) => state.changeQueue)

  // Getting queue from API and saving in queueStore
  const getQueue = async () => {

    try {
        const queueData = await GetQueue({
            accessToken: accessToken,
        })

        const artistNames = await queueData.currently_playing.artists.map(artist => artist.name).join(', ');
        const currPlaying = {
            id: queueData.currently_playing.id,
            title: queueData.currently_playing.name,
            artist: artistNames,
            img: queueData.currently_playing.album.images[0].url
        };

        const currQueue = []
        await queueData.queue.map((curr) => {
            const queueArtistNames = curr.artists.map(artist => artist.name).join(', ');

            currQueue.push({
                id: curr.id,
                title: curr.name,
                artist: queueArtistNames,
            })
        })
        changeQueue(currQueue)

        userQueue_updateQueue({
            userID: userId, 
            userQueueList: currQueue,
        })

    } catch (error) {
      console.error(error)
    }
  }

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
          apiLogin().then(() => {
            userQueue_getQueue({userID: userId}).then(checkQueue => {
              if (checkQueue) {
                changeQueue(checkQueue)
                console.log('queue from firebase')
              } else {
                getQueue()
                console.log('queue from API')
              }
            });  
          })
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
