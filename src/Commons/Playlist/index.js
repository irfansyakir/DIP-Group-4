import { FlatList, Image, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BoldText, LightText, MediumText } from '../UI/styledText'
import { GetPlaylistDetails } from '../../Utilities/SpotifyApi/Utils'
import { GetPlaylistSongs } from '../../Utilities/SpotifyApi/Utils'
import { useAuthStore } from '../../Store/useAuthStore'
import { COLORS } from '../../Constants'
import SingleSong from '../Songs/SingleSong'
import { userQueue_updateQueue } from '../../Utilities/Firebase/user_queue_functions'
import { useQueueStore } from '../../Store/useQueueStore'

export const Playlist = ({ route }) => {
    // const [input, setInput] = useState('')
    const insets = useSafeAreaInsets()
    const navigation = useNavigation()
    const playlistID = route.params
    const accessToken = useAuthStore((state) => state.accessToken)
    const userId = useAuthStore((state) => state.userId)
    const storeQueue = useQueueStore((state) => state.queue)
    const changeQueue = useQueueStore((state) => state.changeQueue)

    // states
    const [playlistName, setPlaylistName] = useState('Loading...')
    const [description, setDescription] = useState('Loading...')
    const [coverUrl, setCoverUrl] = useState('')
    const [followers, setFollowers] = useState(0)
    const [totalSongs, setTotalSongs] = useState(0)
    const [songs, setSongs] = useState([])

    const getPlaylistData = async () => {
        try {
            const playlistData = await GetPlaylistDetails({
                accessToken: accessToken,
                playlistId: playlistID,
            })
            setPlaylistName(playlistData.name)
            setDescription(playlistData.description || '')
            setCoverUrl(playlistData.images[0].url)
            setFollowers(playlistData.followers.total)
            setTotalSongs(playlistData.tracks.total)
        } catch (err) {
            console.error(err)
        }
    }

    const getPlaylistTracks = async () => {
        try {
            const playlistData = await GetPlaylistSongs({
                accessToken: accessToken,
                playlistId: playlistID,
            })
            /*setPlaylistName(playlistData.name)
      setDescription(playlistData.description || '')
      setCoverUrl(playlistData.images[0].url)
      setFollowers(playlistData.followers.total)
      setTotalSongs(playlistData.tracks.total)*/
            const playlistSongs = []
            playlistData.items.map((item) => {
                playlistSongs.push({
                    id: item.track.id,
                    img: item.track.album.images[0].url,
                    title: item.track.name,
                    artist: item.track.artists[0].name,
                })
            })
            setSongs(playlistSongs)
        } catch (err) {
            console.error(err)
        }
    }

    const handlePlayPlaylist = () => {
        const newQueue = [...songs.slice(1), ...storeQueue]

        changeQueue(newQueue)
        userQueue_updateQueue({
            userID: userId,
            userQueueList: newQueue,
        })
    }

    useEffect(() => {
        getPlaylistData()
        getPlaylistTracks()
    }, [])

    return (
        <LinearGradient colors={['#836E55', '#4C4134', '#15120F']} style={{ flex: 1 }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    flex: 1,
                    marginTop: 20,
                    paddingTop: insets.top,
                    marginHorizontal: 20,
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 15 }}>
                    <Ionicons name='chevron-back' size={25} color='white' />
                </TouchableOpacity>

                {/* <TouchableOpacity
          style={{
            flexDirection: 'row',
            backgroundColor: '#7E6E5B',
            height: 38,
            alignItems: 'center',
            gap: 10,
            borderRadius: 3,
            padding: 9,
          }}
        >
          <AntDesign name='search1' size={20} color='white' />
          <TextInput
            value={input}
            onChangeText={(text) => setInput(text)}
            autoFocus={false}
            placeholder='Find in Playlist'
            placeholderTextColor={'white'}
            style={{
              fontFamily: 'InterLight',
              fontSize: 12,
              color: 'white',
            }}
          />
        </TouchableOpacity> */}

                <View style={{ position: 'relative' }}>
                    <Image
                        style={{
                            width: 350,
                            height: 350,
                            borderRadius: 2,
                            marginTop: 20,
                        }}
                        src={coverUrl}
                    />
                    <View
                        style={{
                            right: 10,
                            bottom: 10,
                            position: 'absolute',
                        }}
                    >
                        <BoldText
                            style={{
                                color: 'white',
                                fontSize: 26,
                                textShadowColor: 'rgba(0, 0, 0, 0.75)',
                                textShadowOffset: { width: -1, height: 1 },
                                textShadowRadius: 10,
                            }}
                        >
                            {playlistName}
                        </BoldText>
                    </View>
                </View>

                {description === '' ? null : (
                    <LightText style={{ fontSize: 12, color: 'white', marginTop: 10 }}>
                        {description}
                    </LightText>
                )}

                <View
                    style={{
                        marginTop: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                    }}
                >
                    <View style={{ display: 'flex', width: '60%', gap: 2 }}>
                        <MediumText style={{ fontSize: 10, color: COLORS.light }}>
                            {totalSongs} songs | {followers} saves
                        </MediumText>
                    </View>

                    <TouchableOpacity
                        style={{
                            width: 55,
                            height: 55,
                            borderRadius: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginHorizontal: 10,
                            backgroundColor: '#41BBC4',
                        }}
                        onPress={handlePlayPlaylist}
                    >
                        <Entypo name='controller-play' size={30} color='black' />
                    </TouchableOpacity>
                </View>
                <View style={{ marginBottom: 150 }}>
                    {songs.map((item) => {
                        return <SingleSong key={item.id} item={item} />
                        // return (
                        //   <TouchableOpacity
                        //     key={Math.random()}
                        //     style={{
                        //       flexDirection: 'row',
                        //       alignItems: 'center',
                        //       padding: 10,
                        //     }}
                        //   >
                        //     <Image
                        //       style={{
                        //         width: 50,
                        //         height: 50,
                        //         marginRight: 10,
                        //       }}
                        //       src={item.imageUrl}
                        //     />

                        //     <View style={{ flex: 1 }}>
                        //       <Text
                        //         numberOfLines={1}
                        //         style={{ fontWeight: '400', fontSize: 16, color: 'white' }}
                        //       >
                        //         {item.title}
                        //       </Text>
                        //       <Text style={{ marginTop: 4, color: '#9A9A9A' }}>
                        //         {item.artist}
                        //       </Text>
                        //     </View>

                        //     <View
                        //       style={{
                        //         flexDirection: 'row',
                        //         alignItems: 'center',
                        //         marginHorizontal: 10,
                        //       }}
                        //     >
                        //       <Entypo
                        //         name='dots-three-horizontal'
                        //         size={24}
                        //         color='#ABA4A3'
                        //       />
                        //     </View>
                        //   </TouchableOpacity>
                        // )
                    })}
                </View>
            </ScrollView>
        </LinearGradient>
    )
}
