import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { COLORS } from '../../Constants'
import {
    FlatList,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { GetRecentlyPlayed } from '../../Utilities/SpotifyApi/Utils'
import { GetUserPlaylists } from '../../Utilities/SpotifyApi/Utils'
import { GetQueue } from '../../Utilities/SpotifyApi/Utils'
import { useAuthStore } from '../../Store/useAuthStore'
import { GetCurrentUserProfile } from '../../Utilities/SpotifyApi/Utils'
import { useNavigation } from '@react-navigation/native' // Import useNavigation
import { useMusicStore } from '../../Store/useMusicStore'
import { useQueueStore } from '../../Store/useQueueStore'
import { GetTrack } from '../../Utilities/SpotifyApi/Utils'
import { Audio } from 'expo-av'
import { debounce } from '../../Utilities/Functions/debounce'
import {
  userQueue_getQueue,
  userQueue_updateQueue,
} from '../../Utilities/Firebase/user_queue_functions'
import {useProfileStore} from "../../Store/useProfileStore";

//Danish's Home Page
//Needs testing first

//Todo
//0. Fix Flatlist inside Scrollview
//1. Put code inside the View component w/ insets
//2. Put the playlists as parameters
//3. Implement lazy loading w/ the recommendedPlaylists (so home page not so empty)
//    a. Fetch most recent RadioRoom playlists from our database
//    b. Lazy load when the recc. part is on display (use https://medium.com/swlh/lazy-loading-with-react-native-62cfe03986a4 as source)

export const Home = () => {
    const insets = useSafeAreaInsets()
    const accessToken = useAuthStore((state) => state.accessToken)
    const [recentlyPlayed, setRecentlyPlayed] = useState([])
    const [playlists, setPlaylists] = useState([])
    const soundObject = useMusicStore((state) => state.soundObject)
    const changeSongInfo = useMusicStore((state) => state.changeSongInfo)
    const changeSoundObject = useMusicStore((state) => state.changeSoundObject)
    const changeIsPlaying = useMusicStore((state) => state.changeIsPlaying)
    const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)
    const navigation = useNavigation()

    const [userId, setUserId] = useState()
    const changeUserId = useAuthStore((state) => state.changeUserId)

    const changeDisplayName = useProfileStore((state) => state.changeDisplayName)
    const changeProfileURL = useProfileStore((state) => state.changeProfileUrl)

    const changeQueue = useQueueStore((state) => state.changeQueue)

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

    const debouncedTrackClick = debounce((trackId) => handleTrackClick(trackId))

    const getRecentlyPlayed = async () => {
        try {
            const recentlyPlayedData = await GetRecentlyPlayed({
                accessToken: accessToken,
                limit: 5,
            })
            const currRecentlyPlayed = []
            recentlyPlayedData.items.map((curr) => {
                currRecentlyPlayed.push({
                    id: curr.track.id,
                    title: curr.track.name,
                    photoUrl: curr.track.album.images[0].url,
                })
            })
            setRecentlyPlayed(currRecentlyPlayed)
        } catch (err) {
            console.error(err)
        }
    }

    const getPlaylistData = async () => {
        // fetch data on load
        try {
            const playlistData = await GetUserPlaylists({
                accessToken: accessToken,
            })
            const playlistArray = []
            playlistData.items.map((playlist) => {
                playlistArray.push({
                    id: playlist.id,
                    photoUrl: playlist.images[0].url,
                    name: playlist.name,
                    owner: playlist.owner.display_name,
                    total: playlist.tracks.total,
                })
            })
            setPlaylists(playlistArray)
        } catch (error) {
            console.error(error)
        }
    }

    const getUserProfile = async () => {
      try {
          const userProfileData = await GetCurrentUserProfile({
              accessToken: accessToken,
          })

          console.log(userProfileData)

          const currUserId = userProfileData.id
          changeUserId(currUserId)
          setUserId(currUserId)

          changeDisplayName(userProfileData.display_name)
          changeProfileURL(userProfileData.images[1].url)

      } catch (error) {
          console.error(error)   
      }
    }

      // Getting queue from API and saving in queueStore
    const getQueue = async () => {
      const currQueue = []

      try {
          const queueData = await GetQueue({
              accessToken: accessToken,
          })

          console.log(queueData)

          if(queueData.currently_playing){
              const artistNames = queueData.currently_playing.artists.map(artist => artist.name).join(', ');
              const currPlaying = {
                  id: queueData.currently_playing.id,
                  title: queueData.currently_playing.name,
                  artist: artistNames,
                  img: queueData.currently_playing.album.images[0].url
              };

              await queueData.queue.map((curr) => {
                const queueArtistNames = curr.artists.map(artist => artist.name).join(', ');

                currQueue.push({
                    id: curr.id,
                    title: curr.name,
                    artist: queueArtistNames,
                    img: curr.album.images[0].url
                    })
              })
          }

          changeQueue(currQueue)

          userQueue_updateQueue({
              userID: userId,
              userQueueList: currQueue,
          })

      } catch (error) {
        console.error(error)
      }
    }

    useEffect(() => {
        getRecentlyPlayed()
        getPlaylistData()
        getUserProfile()
    }, [])

    useEffect(() => {
      if (userId) {
        userQueue_getQueue({userID: userId}).then(checkQueue => {
          console.log(checkQueue)
          checkQueue ? changeQueue(checkQueue) : getQueue()
        });
      }
    }, [userId])

    return (
        <View
            style={{
                paddingTop: insets.top, // Add top inset as padding
                flex: 1, // Make sure the content fills the available space
                backgroundColor: COLORS.dark, // Adjust background color as needed
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <ScrollView style={{ width: '100%' }}>
                <Text
                    style={{
                        color: 'white',
                        marginHorizontal: 10,
                        fontSize: 17,
                        fontWeight: 'bold',
                        marginVertical: 10,
                    }}
                >
                    Recently Played
                </Text>

                <FlatList
                    style={{ marginHorizontal: 10 }}
                    horizontal={true}
                    data={recentlyPlayed}
                    keyExtractor={() => Math.random() * 10}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                debouncedTrackClick(item.id)
                            }}
                        >
                            <Image
                                style={{
                                    width: 100,
                                    height: 100,
                                    marginRight: 10,
                                }}
                                src={item.photoUrl}
                            />

                            <View>
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode='tail'
                                    style={{
                                        fontWeight: '400',
                                        fontSize: 10,
                                        color: 'white',
                                        width: 100,
                                        flex: 1,
                                    }}
                                >
                                    {item.title}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />

                <View
                    style={{
                        marginTop: 10,
                        marginBottom: 5,
                        borderBottomColor: COLORS.black,
                        borderBottomWidth: 5,
                    }}
                />

                <View>
                    <Text
                        style={{
                            fontSize: 17,
                            color: 'white',
                            fontWeight: 'bold',
                            marginHorizontal: 10,
                            marginVertical: 15,
                        }}
                    >
                        Playlists
                    </Text>
                </View>

                {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              // width:50,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 10,
              backgroundColor: '#595861',
            }}
          >
            <AntDesign name='plus' size={24} color='white' />
          </TouchableOpacity>
          <Text
            style={{
              color: 'white',
              fontSize: 15,
              fontWeight: 'bold',
              marginLeft: 5,
            }}
          >
            Create Playlist
          </Text>
        </View> */}

                <View style={styles.playlistContainer}>
                    {playlists.map((playlist) => {
                        return (
                            <TouchableOpacity
                                key={playlist.id}
                                onPress={() => {
                                    changeCurrentPage('Playlist')
                                    navigation.navigate('Playlist', playlist.id)
                                }}
                            >
                                {renderTableRow(
                                    playlist.photoUrl,
                                    playlist.name,
                                    playlist.owner
                                )}
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    playlistContainer: {
        marginTop: 10,
        flex: 1,
        alignItems: 'stretch',
        marginLeft: 10,
    },
})

const renderTableRow = (imageSource, title, description) => (
    <View
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
    >
        <Image
            style={{
                width: 50,
                height: 50,
                marginRight: 10,
                justifyContent: 'center',
            }}
            src={imageSource}
            contentFit={'fill'}
        />
        <View style={{ flex: 1, marginLeft: 5 }}>
            <Text
                numberOfLines={1}
                ellipsizeMode='tail'
                style={{
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontWeight: '400',
                    width: 250,
                }}
            >
                {title}
            </Text>
            <Text style={{ fontSize: 13, color: '#B3B3B3' }}>
                {description}
            </Text>
        </View>
    </View>
)
