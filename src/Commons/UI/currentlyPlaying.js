import { View, Image, TouchableOpacity, Pressable, Alert, Text } from 'react-native'
import { Dimensions } from 'react-native'
import { LightText, BoldText, MediumText } from './styledText'
import { COLORS, DISPLAY_NONE_ROOMS, SIZES } from '../../Constants'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useMusicStore } from '../../Store/useMusicStore'
import { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useQueueStore } from '../../Store/useQueueStore'
import { GetTrack } from '../../Utilities/SpotifyApi/Utils'
import { Audio } from 'expo-av'
import { useAuthStore } from '../../Store/useAuthStore'
import {
    userQueue_getRoomQueue,
    userQueue_updatexQueue,
    userQueue_updateRoomQueue,
    userQueue_updateQueue,
} from '../../Utilities/Firebase/user_queue_functions'
import { current_track_updateCurrentTrack } from '../../Utilities/Firebase/current_track_functions'
import { emptyQueue } from './toaster'
import { useRoomBroadcasterListener } from '../../Utilities/Firebase/useFirebaseListener'
import { room_changeBroadcaster } from '../../Utilities/Firebase/room_functions'

const SongProgessBar = ({ currentTime, duration, currentPage }) => {
    return (
        <View
            style={{
                height: currentPage === 'Chatroom' ? 7 : 4,
                backgroundColor: '#100D22',
                borderRadius: 3,
            }}
        >
            <View
                style={{
                    width: `${(currentTime / duration) * 100}%`,
                    height: '100%',
                    backgroundColor: COLORS.light,
                    borderRadius: 3,
                }}
            />
        </View>
    )
}

export function CurrentlyPlaying() {
    const screenWidth = Dimensions.get('window').width
    const accessToken = useAuthStore((state) => state.accessToken)
    const userId = useAuthStore((state) => state.userId)
    const navigation = useNavigation()
    const insets = useSafeAreaInsets()

    // music store
    const songInfo = useMusicStore((state) => state.songInfo)
    const isPlaying = useMusicStore((state) => state.isPlaying)
    const soundObject = useMusicStore((state) => state.soundObject)
    const changeSoundObject = useMusicStore((state) => state.changeSoundObject)
    const changeIsPlaying = useMusicStore((state) => state.changeIsPlaying)
    const currentPage = useMusicStore((state) => state.currentPage)
    const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)
    const changeSongInfo = useMusicStore((state) => state.changeSongInfo)
    const position = useMusicStore((state) => state.position)
    const changePosition = useMusicStore((state) => state.changePosition)
    const isRepeat = useMusicStore((state) => state.isRepeat)

    const radioRoom_isDJ = useMusicStore((state) => state.radioRoom_isDJ)
    const roomId = useMusicStore((state) => state.radioRoom_roomId)
    const changeRadioRoom_isBroadcasting = useMusicStore(
        (state) => state.changeRadioRoom_isBroadcasting
    )
    // queue store
    const queue = useQueueStore((state) => state.queue)
    const changeQueue = useQueueStore((state) => state.changeQueue)
    const role = useQueueStore((state) => state.role)

    const play = async () => {
        try {
            if (soundObject) await soundObject.playAsync()
        } catch (err) {
            console.log(err)
        }
    }

    const pause = async () => {
        try {
            if (soundObject) await soundObject.pauseAsync()
        } catch (err) {
            console.log(err)
        }
    }

    const createSoundObject = async (uri) => {
        // clear previous song
        if (soundObject) {
            changeIsPlaying(false)
            await soundObject.unloadAsync()
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
            return {
                coverUrl: trackData.album.images[0].url,
                songTitle: trackData.name,
                songArtist: trackData.artists[0].name,
                songAlbum: trackData.album.name,
                preview_url: trackData.preview_url,
            }
        } catch (err) {
            console.error(err)
        }
    }

    const updatePosition = async (intervalId) => {
        if (soundObject) {
            const status = await soundObject.getStatusAsync()
            changePosition(status.positionMillis)

            // if currently playing song is completed
            if (status.positionMillis > status.durationMillis - 90) {
                if (role === 'personal' || role === 'broadcaster') {
                    clearInterval(intervalId)
                    if (isRepeat) {
                        changeIsPlaying(false)
                        await soundObject.setPositionAsync(0)
                        changePosition(0)
                        changeIsPlaying(true)
                        return
                    }
                }

                if (role === 'personal') {
                    if (queue.length !== 0) {
                        const currSong = queue[0]
                        changeQueue(queue.slice(1))
                        userQueue_updateQueue({
                            userID: userId,
                            userQueueList: queue.slice(1),
                        })
                        await getTrackData(currSong.id)
                    } else {
                        changeIsPlaying(false)
                        await soundObject.setPositionAsync(0)
                        changePosition(0)
                    }
                    return
                }

                if (role === 'broadcaster') {
                    handleNextSongRoom()
                }
            }
        }
    }

    const handleNextSongRoom = async () => {
        changeIsPlaying(false)
        const roomQueue = await userQueue_getRoomQueue({ roomID: roomId })
        if (!roomQueue || roomQueue.length === 0) {
            await soundObject.setPositionAsync(0)
            await current_track_updateCurrentTrack({
                roomID: roomId,
                trackURL: null,
                isCurrentTrackPlaying: false,
                songInfo: null,
            })
            changePosition(0)
            soundObject.unloadAsync()
            changeSoundObject(null)
            changeCurrentPage('RoomQueue')
            navigation.navigate('RoomQueue', { roomID: roomId })
            emptyQueue()
        } else {
            const { coverUrl, songAlbum, songArtist, songTitle, preview_url } = await getTrackData(
                roomQueue[0].id
            )
            await current_track_updateCurrentTrack({
                roomID: roomId,
                trackURL: preview_url,
                songInfo: {
                    coverUrl: coverUrl,
                    songAlbum: songAlbum,
                    songArtist: songArtist,
                    songTitle: songTitle,
                },
            })
            await userQueue_updateRoomQueue({
                roomID: roomId,
                userRoomQueueList: roomQueue.length === 1 ? [] : roomQueue.slice(1),
            })
        }
    }

    useEffect(() => {
        if (role === 'broadcaster') {
            current_track_updateCurrentTrack({
                roomID: roomId,
                timeOfLastPlayed: position,
            }).then()
        }
    }, [position, role])

    useEffect(() => {
        if (soundObject && isPlaying) {
            // Periodically update the playback position
            const intervalId = setInterval(() => updatePosition(intervalId), 500)
            // Clean up the interval when the component unmounts
            return () => clearInterval(intervalId)
        }
    }, [soundObject, isPlaying, role])

    useEffect(() => {
        if (soundObject) {
            isPlaying ? play() : pause()
        }
        if (role === 'broadcaster') {
            current_track_updateCurrentTrack({
                roomID: roomId,
                isCurrentTrackPlaying: isPlaying,
            }).then()
        }
    }, [isPlaying])

    if (currentPage === 'Chatroom') {
        return (
            <Pressable
                style={{
                    position: 'absolute',
                    width: screenWidth - 20,
                    left: 10,
                    right: 10,
                    height: 100,
                    bottom: 0,
                    top: insets.top + 100,
                    transition: 'all 0.3s ease-out',
                    backgroundColor: COLORS.darkblue,
                    borderRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    display: 'flex',
                }}
                onPress={() => {
                    navigation.navigate('Track')
                    changeCurrentPage('Track')
                }}
                disabled={!soundObject}
            >
                {!soundObject ? (
                    <View style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 4 }}>
                        <BoldText
                            style={{
                                color: 'white',
                                fontSize: SIZES.medium,
                            }}
                        >
                            No song is currently playing now :(
                        </BoldText>
                        <MediumText
                            style={{
                                color: 'white',
                                fontSize: SIZES.small,
                            }}
                        >
                            If you're the DJ, please add some song to queue!
                        </MediumText>
                    </View>
                ) : (
                    <>
                        <Image
                            style={{
                                width: 70,
                                height: 70,
                                borderRadius: 5,
                            }}
                            src={songInfo.coverUrl}
                        />
                        <View
                            aria-label='text and bar'
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                flex: 1,
                                height: '100%',
                                paddingLeft: 10,
                                justifyContent: 'center',
                            }}
                        >
                            <View
                                aria-label='text and play button box'
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    marginVertical: 10,
                                }}
                            >
                                <View
                                    aria-label='text box'
                                    style={{
                                        flexGrow: 1,
                                        display: 'flex',
                                    }}
                                >
                                    <BoldText
                                        style={{
                                            color: 'white',
                                            fontSize: SIZES.medium,
                                            width: 200,
                                        }}
                                        numberOfLines={1}
                                        ellipsizeMode='tail'
                                    >
                                        {songInfo.songTitle}
                                    </BoldText>
                                    <LightText
                                        style={{
                                            color: COLORS.light,
                                            fontSize: SIZES.sm,
                                        }}
                                    >
                                        {songInfo.songArtist}
                                    </LightText>
                                </View>

                                <TouchableOpacity
                                    onPress={() => {
                                        if (radioRoom_isDJ) {
                                            room_changeBroadcaster({
                                                roomID: roomId,
                                                userID: userId,
                                            }).then(() => {
                                                changeIsPlaying(!isPlaying)
                                            })
                                        } else {
                                            Alert.alert('Dj permissions', 'Not a DJ', [
                                                {
                                                    text: 'OK :(',
                                                    onPress: () => console.log('OK Pressed'),
                                                },
                                            ])
                                        }
                                    }}
                                    style={{ marginRight: 5 }}
                                >
                                    {/* update state for pause and play */}
                                    {!isPlaying ? (
                                        <Ionicons name='play' size={35} color={COLORS.white} />
                                    ) : (
                                        <Ionicons name='pause' size={35} color={COLORS.white} />
                                    )}
                                </TouchableOpacity>
                            </View>
                            <SongProgessBar
                                currentTime={position}
                                duration={29749}
                                currentPage={currentPage}
                            />
                        </View>
                    </>
                )}
            </Pressable>
        )
    } else if (soundObject) {
        return (
            <Pressable
                style={{
                    position: 'absolute',
                    width: screenWidth - 20,
                    left: 10,
                    right: 10,
                    height: 70,
                    bottom: insets.bottom + 60,
                    top: null,
                    transition: 'all 0.3s ease-out',
                    backgroundColor: COLORS.darkblue,
                    borderRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    display: DISPLAY_NONE_ROOMS.includes(currentPage) ? 'none' : 'flex',
                }}
                onPress={() => {
                    navigation.navigate('Track')
                    changeCurrentPage('Track')
                }}
            >
                <Image
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 5,
                    }}
                    src={songInfo.coverUrl}
                />
                <View
                    aria-label='text and bar'
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        height: '100%',
                        paddingLeft: 10,
                        justifyContent: 'center',
                    }}
                >
                    <View
                        aria-label='text and play button box'
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginVertical: 5,
                        }}
                    >
                        <View
                            aria-label='text box'
                            style={{
                                flexGrow: 1,
                                display: 'flex',
                            }}
                        >
                            <BoldText
                                style={{
                                    color: 'white',
                                    fontSize: SIZES.sm,
                                }}
                            >
                                {songInfo.songTitle}
                            </BoldText>
                            <LightText
                                style={{
                                    color: COLORS.light,
                                    fontSize: SIZES.small,
                                }}
                            >
                                {songInfo.songArtist}
                            </LightText>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                changeIsPlaying(!isPlaying)
                            }}
                            style={{ marginRight: 5 }}
                        >
                            {/* update state for pause and play */}
                            {!isPlaying ? (
                                <Ionicons name='play' size={24} color={COLORS.white} />
                            ) : (
                                <Ionicons name='pause' size={24} color={COLORS.white} />
                            )}
                        </TouchableOpacity>
                    </View>
                    <SongProgessBar
                        currentTime={position}
                        duration={29749}
                        currentPage={currentPage}
                    />
                </View>
            </Pressable>
        )
    }
}
