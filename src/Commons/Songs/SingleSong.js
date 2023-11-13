import { Text, TouchableOpacity, View, Image, Touchable } from 'react-native'
import { COLORS, SIZES } from '../../Constants'
import { Audio } from 'expo-av'
import { useAuthStore } from '../../Store/useAuthStore'
import { useMusicStore } from '../../Store/useMusicStore'
import { GetTrack } from '../../Utilities/SpotifyApi/Utils'
import { debounce } from '../../Utilities/Functions/debounce'
import { createIconSetFromIcoMoon } from '@expo/vector-icons'
import { useQueueStore } from '../../Store/useQueueStore'
import {
  userQueue_getQueue,
  userQueue_updateQueue,
} from '../../Utilities/Firebase/user_queue_functions'

const Icon = createIconSetFromIcoMoon(
  require('../../../assets/icomoon/selection.json'),
  'IcoMoon',
  'icomoon.ttf'
)

export default function SingleSong({ item }) {
  const soundObject = useMusicStore((state) => state.soundObject)
  const changeSongInfo = useMusicStore((state) => state.changeSongInfo)
  const changeSoundObject = useMusicStore((state) => state.changeSoundObject)
  const changeIsPlaying = useMusicStore((state) => state.changeIsPlaying)
  const accessToken = useAuthStore((state) => state.accessToken)

  const storeQueue = useQueueStore((state) => state.queue)
  const changeQueue = useQueueStore((state) => state.changeQueue)
  const userId = useAuthStore((state) => state.userId)

  const handleTrackClick = (trackId) => {
    const createSoundObject = async (uri) => {
      // clear previous song
      if (soundObject) {
        changeIsPlaying(false)
        soundObject.unloadAsync()
      }

      const { sound } = await Audio.Sound.createAsync({ uri: uri })
      changeSoundObject(sound)
      changeIsPlaying(true)
    }

    const getTrackData = async () => {
      try {
        const trackData = await GetTrack({
          accessToken: accessToken,
          trackId: trackId,
        })
        changeSongInfo(
          trackData.album.images[0].url,
          trackData.name,
          trackData.artists[0].name,
          trackData.album.name,
          trackData.id
        )
        createSoundObject(trackData.preview_url)
      } catch (err) {
        console.error(err)
      }
    }

    getTrackData()
  }

  const addSongtoQ = () => { 
    const addedSong = {
      id: item.id,
      title: item.title,
      artist: item.artist,
      img: item.coverUrl
    }
    const newQueue = [addedSong, ...storeQueue]

    changeQueue(newQueue)
    userQueue_updateQueue({
      userID: userId,
      userQueueList: newQueue,
    })
  }


  const debouncedTrackClick = debounce((trackId) => handleTrackClick(trackId))

  return (
    <View key={item.id} style={{flex: 1, flexDirection: 'row', justifyContent:'space-between',}}>
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: 'row',
          paddingVertical: 7,
          alignItems: 'center',
        }}
        onPress={() => debouncedTrackClick(item.id)}
      >
        {/* SONG IMAGE */}
        <Image
          style={{ width: 50, height: 50, borderRadius: 10, marginRight: 15 }}
          src={item.coverUrl}
        />
        <View>
          {/* TITLE AND ARTIST */}
          <Text style={{ color: '#FFF', fontSize: SIZES.medium }}>
            {item.title}
          </Text>
          <Text style={{ color: COLORS.grey }}>{item.artist}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={{justifyContent: 'center'}} 
        onPress={() => addSongtoQ()}
      >
          <Icon style={{fontSize: 30, color: COLORS.white,}} name='addqueue'/>
      </TouchableOpacity>
    </View>
  )
}
