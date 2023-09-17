import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useFonts } from 'expo-font'
import { createIconSetFromIcoMoon } from '@expo/vector-icons'
import { Play } from './play'
import { TopBar } from './topbar'
import { useAuthStore } from '../../Store/useAuthStore'
import { useRoute } from '@react-navigation/native'
import { GetPlaylistDetails } from '../../Utilities/SpotifyApi/Utils'
import { Audio } from 'expo-av'

const Icon = createIconSetFromIcoMoon(
  require('../../../assets/icomoon/selection.json'),
  'IcoMoon',
  'icomoon.ttf'
)

export const Track = ({ navigation }) => {
  // temporary: get first track of playlist ID
  const accessToken = useAuthStore((state) => state.accessToken)
  const route = useRoute()
  const { playlistId } = route.params
  const [image, setImage] = useState('')
  const [title, setTitle] = useState('Loading...')
  const [artist, setArtist] = useState('')
  const [songUrl, setSongUrl] = useState('')
  const [soundAudio, setSoundAudio] = useState(null)

  const getPlaylistData = async () => {
    // fetch data on load
    try {
      const playlistData = await GetPlaylistDetails({
        accessToken: accessToken,
        playlistId: playlistId,
        limit: 4,
      })
      setImage(playlistData.items[0].track.album.images[0].url)
      setTitle(playlistData.items[0].track.album.name)
      setArtist(playlistData.items[0].track.artists[0].name)
      setSongUrl(playlistData.items[0].track.preview_url)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getPlaylistData()
  }, [])

  async function playSound() {
    const { status } = await Audio.requestPermissionsAsync()
    if (status === 'granted') {
      if (soundAudio === null) {
        const { sound } = await Audio.Sound.createAsync({ uri: songUrl })
        setSoundAudio(sound)
        await sound.playAsync()
      } else {
        await soundAudio.playAsync()
      }
    } else {
      // Handle permission denied
      console.log('Permission to access audio denied.')
    }
  }

  async function pauseSound() {
    if (soundAudio) {
      await soundAudio.pauseAsync() // Pause the audio
    }
  }

  useEffect(() => {
    return soundAudio
      ? () => {
          soundAudio.unloadAsync()
        }
      : undefined
  }, [soundAudio])

  const [fontsLoaded] = useFonts({
    IcoMoon: require('../../../assets/icomoon/icomoon.ttf'),
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#121212', '#5C4C3F', '#9A7E66']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        locations={[0.6, 0.8, 1]}
        style={styles.linearGradient}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <TopBar navigation={navigation}></TopBar>

          <Image style={styles.img} src={image} />

          <View style={styles.midbar}>
            <View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.desc}>{artist}</Text>
            </View>
            <TouchableOpacity onPress={() => console.log('queue')}>
              <Icon
                style={[styles.icon, styles.marg]}
                name='viewqueue'
                size={33}
              />
            </TouchableOpacity>
          </View>

          <Play handlePlay={playSound} handlePause={pauseSound}></Play>

          <View style={styles.lyrics}>
            <Text style={styles.lyrhead}>Lyrics</Text>
            <Text style={styles.text}>
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum."
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    color: '#FFF',
  },

  img: {
    width: 350,
    height: 350,
    borderRadius: 10,
    marginTop: 20,
  },

  midbar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 350,
  },
  title: {
    color: '#FFF',
    marginTop: 30,
    /* Heading 1 */
    fontSize: 25,
    fontWeight: 'bold',
  },
  desc: {
    color: '#B3B3B3',
    marginTop: 5,
    marginBottom: 7,
    /* Body 3 */
    fontSize: 15,
  },
  marg: {
    marginRight: 10,
    marginTop: 15,
  },

  lyrics: {
    height: 'auto',
    width: 350,
    backgroundColor: '#665959',
    borderRadius: 10,
    padding: 30,
    paddingBottom: 40,
    marginBottom: 100,
  },
  lyrhead: {
    color: '#FFF',
    /* Heading 2 */
    fontSize: 17,
    fontWeight: 'bold',
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 25,
    lineHeight: 25,
  },
})
