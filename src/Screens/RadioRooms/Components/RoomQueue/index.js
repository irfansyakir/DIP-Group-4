import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { Image } from 'expo-image'
import * as React from 'react'
import { createIconSetFromIcoMoon } from '@expo/vector-icons'
import 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import { Audio } from 'expo-av'
import { COLORS } from '../../../../Constants'
import { errorCloseQueueToast } from '../../../../Commons/UI/toaster'
// Store
import { useMusicStore } from '../../../../Store/useMusicStore'
import { useAuthStore } from '../../../../Store/useAuthStore'
import { useQueueStore } from '../../../../Store/useQueueStore'
// Firebase
import { useRoomTrackURLListener } from '../../../../Utilities/Firebase/useFirebaseListener'
import { useRoomCurrentQueue } from '../../../../Utilities/Firebase/useFirebaseListener'
import {
    userQueue_getRoomQueue,
    userQueue_updateRoomQueue,
} from '../../../../Utilities/Firebase/user_queue_functions'
import { GetTrack } from '../../../../Utilities/SpotifyApi/Utils'

import { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { current_track_updateCurrentTrack } from '../../../../Utilities/Firebase/current_track_functions'

const Icon = createIconSetFromIcoMoon(
    require('../../../../../assets/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
)

export const RoomQueue = ({ route, navigation }) => {
    const { roomID, roomName } = route.params || {}
    const accessToken = useAuthStore((state) => state.accessToken)
    const changeQueue = useQueueStore((state) => state.changeQueue)
    const storeCurrTrack = useMusicStore((state) => state.songInfo)
    const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)

    const [refresh, setRefresh] = useState(false)

    const insets = useSafeAreaInsets()
    const soundObject = useMusicStore((state) => state.soundObject)
    const changeSoundObject = useMusicStore((state) => state.changeSoundObject)
    const changeIsPlaying = useMusicStore((state) => state.changeIsPlaying)
    const changeSongInfo = useMusicStore((state) => state.changeSongInfo)
    const changeRoomId = useMusicStore((state) => state.changeRadioRoom_roomId)
    const changeRole = useQueueStore((state) => state.changeRole)
    const storeQueue = useRoomCurrentQueue(roomID) || []

    useEffect(() => {
        changeCurrentPage('RoomQueue')
    }, [])

    const [fontsLoaded] = useFonts({
        IcoMoon: require('../../../../../assets/icomoon/icomoon.ttf'),
    })

    if (!fontsLoaded) {
        return null
    }

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

    const getTrackData = async (trackId) => {
        changeIsPlaying(false)
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
            return trackData.preview_url
        } catch (err) {
            console.error(err)
        }
    }

    const handleStartRoom = async () => {
        const roomQueue = await userQueue_getRoomQueue({ roomID: roomID })
        if (!roomQueue || roomQueue.length === 0) {
            errorCloseQueueToast()
            return
        }

        const preview_url = await getTrackData(roomQueue[0].id)
        await current_track_updateCurrentTrack({
            roomID: roomID,
            trackURL: preview_url,
        })
        await userQueue_updateRoomQueue({
            roomID: roomID,
            userRoomQueueList: roomQueue.length === 1 ? [] : roomQueue.slice(1),
        })

        changeRoomId(roomID)
        changeCurrentPage('Chatroom')
        changeRole('broadcaster')
        navigation.navigate('Chatroom', { roomID: roomID })
    }

    const handleBackButton = () => {
        if (!soundObject) errorCloseQueueToast()
        else navigation.navigate('Chatroom', { roomID: roomID })
    }

    const delSongfromRoomQ = (item) => {
        storeQueue.splice(item.orderId - 1, 1)
        changeQueue(storeQueue)

        userQueue_updateRoomQueue({
            roomID: roomID,
            userRoomQueueList: storeQueue,
        })

        setRefresh(!refresh)
    }

    const generateSongs = () => {
        const orderQ = storeQueue.map((item, index) => {
            return { ...item, orderId: index + 1 }
        })

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={orderQ}
                    keyExtractor={(item) => item.orderId}
                    showsVerticalScrollIndicator={true}
                    extraData={refresh}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                flexDirection: 'row',
                                height: 60,
                                paddingLeft: 16,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <View style={styles.songInQ}>
                                <Image
                                    style={{
                                        width: 45,
                                        height: 45,
                                        borderRadius: 5,
                                    }}
                                    source={item.img}
                                />
                                <View style={{ flex: 1, paddingLeft: 10 }}>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode='tail'
                                        style={styles.songName}
                                    >
                                        {item.title}
                                    </Text>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode='tail'
                                        style={styles.artistName}
                                    >
                                        {item.artist}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={{ paddingRight: 16 }}
                                onPress={() => {
                                    delSongfromRoomQ(item)
                                }}
                            >
                                <Ionicons name={'trash-outline'} size={25} color={COLORS.light} />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        )
    }

    return (
        <GestureHandlerRootView style={[styles.container, { paddingTop: insets.top }]}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: soundObject ? 'space-between' : 'center',
                    paddingLeft: 16,
                    paddingRight: 16,
                    marginBottom: 16,
                    paddingTop: 16,
                }}
            >
                {soundObject && (
                    <TouchableOpacity
                        style={{ justifyContent: 'center' }}
                        onPress={handleBackButton}
                    >
                        <Icon style={styles.icon} name='down' />
                    </TouchableOpacity>
                )}
                <Text style={styles.headerTxt}> {roomName} </Text>
                <View style={{ height: 20, width: 20 }}></View>
            </View>

            {soundObject && (
                <>
                    <Text style={[styles.subHeaderTxt, { marginBottom: 5 }]}>Now Playing</Text>
                    <View style={styles.playingNow}>
                        <Image style={styles.playlistImage} source={storeCurrTrack.coverUrl} />
                        <View style={styles.songDets}>
                            <Text style={styles.currSong}>{storeCurrTrack.songTitle}</Text>
                            <Text style={styles.currArtistName}>{storeCurrTrack.songArtist}</Text>
                        </View>
                    </View>
                </>
            )}

            <Text style={styles.subHeaderTxt}>Queue from: {roomName}</Text>
            {generateSongs()}

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                    paddingVertical: 16,
                }}
            >
                <View style={styles.butContainer}>
                    <TouchableOpacity
                        style={styles.secButtons}
                        onPress={() => {
                            navigation.navigate('AddSong', { roomID: roomID })
                        }}
                    >
                        <Text
                            style={[
                                styles.subHeaderTxt,
                                { alignSelf: 'center', color: COLORS.dark },
                            ]}
                        >
                            Add Songs
                        </Text>
                    </TouchableOpacity>
                </View>
                {!soundObject && (
                    <View style={styles.butContainer}>
                        <TouchableOpacity
                            style={[styles.secButtons, { backgroundColor: COLORS.primary }]}
                            onPress={handleStartRoom}
                        >
                            <Text
                                style={[
                                    styles.subHeaderTxt,
                                    { alignSelf: 'center', color: COLORS.dark },
                                ]}
                            >
                                Start Listening
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: COLORS.dark,
    },
    headerTxt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
        alignSelf: 'center',
    },
    icon: {
        fontSize: 20,
        color: COLORS.white,
    },
    subHeaderTxt: {
        fontSize: 17,
        fontWeight: 'bold',
        color: COLORS.white,
        paddingLeft: 16,
        paddingRight: 16,
    },
    playlistImage: {
        width: 81,
        height: 81,
    },
    playingNow: {
        flexDirection: 'row',
        marginBottom: 20,
        paddingLeft: 16,
        paddingRight: 16,
    },
    songDets: {
        justifyContent: 'center',
        padding: 10,
    },
    currSong: {
        fontSize: 17,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    currArtistName: {
        fontSize: 15,
        color: COLORS.grey,
    },
    songInQ: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    songName: {
        fontSize: 17,
        color: COLORS.white,
    },
    artistName: {
        fontSize: 13,
        color: COLORS.grey,
    },
    draggable: {
        width: 20,
        height: 15,
    },
    butContainer: {
        width: '50%',
        alignItems: 'center',
    },
    secButtons: {
        width: 155,
        backgroundColor: COLORS.light,
        borderRadius: 100,
        height: 42,
        justifyContent: 'center',
    },
})
