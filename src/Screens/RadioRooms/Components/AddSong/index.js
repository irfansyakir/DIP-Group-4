import { Text, TouchableOpacity, View, TextInput, FlatList, Image } from 'react-native'
import { COLORS, SIZES } from '../../../../Constants'
import { BoldText, MediumText } from '../../../../Commons/UI/styledText'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { Audio } from 'expo-av'
import { useAuthStore } from '../../../../Store/useAuthStore'
import { SearchTrack } from '../../../../Utilities/SpotifyApi/Utils'
import { useMusicStore } from '../../../../Store/useMusicStore'
import { GetTrack } from '../../../../Utilities/SpotifyApi/Utils'
import { debounce } from '../../../../Utilities/Functions/debounce'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
    userQueue_updateRoomQueue,
    userQueue_getRoomQueue,
} from '../../../../Utilities/Firebase/user_queue_functions'

export const AddSong = ({ route }) => {
    const { roomID } = route.params || {}

    const insets = useSafeAreaInsets()
    // Initialize navigation
    const navigation = useNavigation()
    const soundObject = useMusicStore((state) => state.soundObject)
    const changeSongInfo = useMusicStore((state) => state.changeSongInfo)
    const changeSoundObject = useMusicStore((state) => state.changeSoundObject)
    const changeIsPlaying = useMusicStore((state) => state.changeIsPlaying)
    const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)

    useEffect(() => {
        changeCurrentPage('AddSong')
    }, [])

    const debouncedTrackClick = debounce((trackId) => handleTrackClick(trackId))

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

    const [input, setInput] = useState()
    const [data, setData] = useState([])

    const accessToken = useAuthStore((state) => state.accessToken)
    const onChangeText = async (text) => {
        setInput(text)

        if (text.length == 0) setData([])
        // else setData(test);
        else {
            try {
                const trackdata = await SearchTrack({
                    accessToken: accessToken,
                    text: text,
                })
                // console.log(trackdata.tracks.items[0].artists[0].name)
                const trackArray = []
                trackdata.tracks.items.map((track) => {
                    trackArray.push({
                        id: track.id,
                        coverUrl: track.album.images[0].url,
                        title: track.name,
                        artist: track.artists[0].name,
                    })
                })
                setData(trackArray)
            } catch (error) {
                console.error(error)
            }
        }
    }

    const addSongtoRoomQ = async (item) => {
        // if (!soundObject) {
        //     handleTrackClick(item.id)
        // }
        const storeQueue = await userQueue_getRoomQueue({ roomID: roomID })
        const addedSong = {
            id: item.id,
            title: item.title,
            artist: item.artist,
            img: item.coverUrl,
        }

        let newQueue = []
        if (storeQueue) newQueue = [...storeQueue, addedSong]
        else newQueue = [addedSong]

        userQueue_updateRoomQueue({
            roomID: roomID,
            userRoomQueueList: newQueue,
        })
    }

    const renderItem = ({ item }) => (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 7,
            }}
        >
            <TouchableOpacity
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                onPress={() => debouncedTrackClick(item.id)}
            >
                {/* SONG IMAGE */}
                <Image
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 10,
                        marginRight: 15,
                    }}
                    src={item.coverUrl}
                />
                <View>
                    {/* TITLE AND ARTIST */}
                    <Text
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        style={{ color: '#FFF', fontSize: SIZES.medium }}
                    >
                        {item.title}
                    </Text>
                    <Text style={{ color: COLORS.grey }}>{item.artist}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => addSongtoRoomQ(item)}>
                <Ionicons name={'add-circle-outline'} style={{}} size={35} color={COLORS.light} />
            </TouchableOpacity>
        </View>
    )

    return (
        <View style={{ backgroundColor: COLORS.dark, flex: 1 }}>
            <View
                style={{
                    paddingTop: insets.top,
                    padding: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ justifyContent: 'center', marginTop: 20 }}
                >
                    <Ionicons name={'arrow-back'} size={25} color={COLORS.grey} />
                </TouchableOpacity>
                <View
                    style={{
                        marginTop: 20,
                        flexDirection: 'row',
                        backgroundColor: '#333',
                        borderRadius: 10,
                        alignItems: 'center',
                        paddingHorizontal: 10,
                    }}
                >
                    <Ionicons name={'ios-search'} size={20} color={COLORS.grey} />
                    <TextInput
                        autoFocus={true}
                        style={{
                            color: COLORS.light,
                            width: 250,
                            fontSize: SIZES.medium,
                            padding: 10,
                        }}
                        placeholder='What do you want to listen to?'
                        placeholderTextColor={COLORS.grey}
                        value={input}
                        onChangeText={onChangeText}
                    />
                </View>
            </View>

            <View style={{ paddingHorizontal: 20 }}>
                <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.id} />
            </View>
        </View>
    )
}
