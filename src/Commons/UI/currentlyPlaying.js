import { View, Image, TouchableOpacity, Pressable, Alert } from 'react-native'
import { Dimensions } from 'react-native'
import { LightText, BoldText } from './styledText'
import { COLORS, SIZES } from '../../Constants'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useMusicStore } from '../../Store/useMusicStore'
import { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useQueueStore } from '../../Store/useQueueStore'
import { GetTrack } from '../../Utilities/SpotifyApi/Utils'
import { Audio } from 'expo-av'
import { useAuthStore } from '../../Store/useAuthStore'
import { userQueue_updateQueue } from '../../Utilities/Firebase/user_queue_functions'

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
    const duration = useMusicStore((state) => state.duration)
    const changeDuration = useMusicStore((state) => state.changeDuration)
    const isRepeat = useMusicStore((state) => state.isRepeat)

    const radioRoom_isDJ = useMusicStore((state) => state.radioRoom_isDJ)
    const changeRadioRoom_isBroadcasting = useMusicStore(
        (state) => state.changeRadioRoom_isBroadcasting
    )

    // queue store
    const queue = useQueueStore((state) => state.queue)
    const changeQueue = useQueueStore((state) => state.changeQueue)

    const navigation = useNavigation()
    const insets = useSafeAreaInsets()

    const play = async () => {
        try {
            await soundObject.playAsync()
        } catch (err) {
            console.log(err)
        }
    }

    const pause = async () => {
        try {
            await soundObject.pauseAsync()
        } catch (err) {
            console.log(err)
        }
    }

    const handleNextSong = (trackId) => {
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
        changeIsPlaying(false)
        getTrackData()
    }

    const updatePosition = async (intervalId) => {
        if (soundObject) {
            const status = await soundObject.getStatusAsync()
            changePosition(status.positionMillis)
            changeDuration(status.durationMillis)

            // if currently playing song is completed
            if (status.positionMillis > status.durationMillis - 90) {
                clearInterval(intervalId)
                if (isRepeat) {
                    changeIsPlaying(false)
                    await soundObject.setPositionAsync(0)
                    changePosition(0)
                    changeIsPlaying(true)
                } else if (queue.length !== 0) {
                    const currSong = queue[0]
                    changeQueue(queue.slice(1))
                    userQueue_updateQueue({
                        userID: userId,
                        userQueueList: queue.slice(1),
                    })
                    handleNextSong(currSong.id)
                } else {
                    changeIsPlaying(false)
                    await soundObject.setPositionAsync(0)
                    changePosition(0)
                }
            }
        }
    }

    useEffect(() => {
        if (soundObject && isPlaying) {
            // Periodically update the playback position
            const intervalId = setInterval(() => updatePosition(intervalId), 500)
            // Clean up the interval when the component unmounts
            return () => clearInterval(intervalId)
        }
    }, [soundObject, isPlaying])

    useEffect(() => {
        if (soundObject) {
            isPlaying ? play() : pause()
        }
    }, [isPlaying])

    if (soundObject) {
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
                        display: currentPage === 'Track' ? 'none' : 'flex',
                    }}
                    onPress={() => {
                        navigation.navigate('Track')
                        changeCurrentPage('Track')
                    }}
                >
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
                                    }}
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
                                        changeIsPlaying(!isPlaying)
                                        //since isPlaying does not update instantaneously, use !isPlaying as workaround
                                        changeRadioRoom_isBroadcasting(!isPlaying)
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
                            duration={duration - 39}
                            currentPage={currentPage}
                        />
                    </View>
                </Pressable>
            )
        } else {
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
                        display: currentPage === 'Track' || 'AddSong' ? 'none' : 'flex',
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
                            duration={duration - 39}
                            currentPage={currentPage}
                        />
                    </View>
                </Pressable>
            )
        }
    } else {
        return null
    }
}
