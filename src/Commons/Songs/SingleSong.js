import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native'
import { COLORS, SIZES } from '../../Constants'
import { Audio } from 'expo-av'
import { useAuthStore } from '../../Store/useAuthStore'
import { useMusicStore } from '../../Store/useMusicStore'
import { GetTrack } from '../../Utilities/SpotifyApi/Utils'
import { debounce } from '../../Utilities/Functions/debounce'

export default function SingleSong({ item }) {
  const soundObject = useMusicStore((state) => state.soundObject)
  const changeSongInfo = useMusicStore((state) => state.changeSongInfo)
  const changeSoundObject = useMusicStore((state) => state.changeSoundObject)
  const changeIsPlaying = useMusicStore((state) => state.changeIsPlaying)
  const accessToken = useAuthStore((state) => state.accessToken)

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
          trackData.album.name
        )
        createSoundObject(trackData.preview_url)
      } catch (err) {
        console.error(err)
      }
    }

    getTrackData()
  }

  const debouncedTrackClick = debounce((trackId) => handleTrackClick(trackId))

  return (
    <TouchableOpacity onPress={() => debouncedTrackClick(item.id)}>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 7,
          alignItems: 'center',
        }}
      >
        {/* SONG IMAGE */}
        <Image style={styles.img} src={item.coverUrl} />
        <View>
          {/* TITLE AND ARTIST */}
          <Text style={{ color: '#FFF', fontSize: SIZES.medium }}>
            {item.title}
          </Text>
          <Text style={{ color: COLORS.grey }}>{item.artist}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems:'center'
  },
  button: {
    backgroundColor: COLORS.light,
    padding: 10,
    paddingLeft: 20,
    marginTop: 15,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sbar: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  input: {
    color: COLORS.light,
    width: 250,
    fontSize: SIZES.medium,

    padding: 10,
    // borderColor: '#bbb',
    // borderWidth: 1,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
})
