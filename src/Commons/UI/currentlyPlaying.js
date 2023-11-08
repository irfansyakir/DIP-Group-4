import { View, Image, TouchableOpacity, Pressable } from 'react-native'
import { Dimensions } from 'react-native'
import { LightText, MediumText } from './styledText'
import { COLORS } from '../../Constants'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useMusicStore } from '../../Store/useMusicStore'
import { useQueueStore } from '../../Store/useQueueStore'
import { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GetTrack } from '../../Utilities/SpotifyApi/Utils'
import { Audio } from 'expo-av'
import { useAuthStore } from '../../Store/useAuthStore'

const SongProgessBar = ({ currentTime, duration }) => {
    return (
        <View
            style={{
                height: 4,
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

export function CurrentlyPlaying({ currentPage }) {
    const screenWidth = Dimensions.get('window').width
    const accessToken = useAuthStore((state) => state.accessToken)

    // music store
    const songInfo = useMusicStore((state) => state.songInfo)
    const isPlaying = useMusicStore((state) => state.isPlaying)
    const soundObject = useMusicStore((state) => state.soundObject)
    const changeSoundObject = useMusicStore((state) => state.changeSoundObject)
    const changeIsPlaying = useMusicStore((state) => state.changeIsPlaying)
    const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)
    const changeSongInfo = useMusicStore((state) => state.changeSongInfo)
    const position = useMusicStore((state) => state.position)
    const changePosition = useMusicStore((state) => state.changePosition)
    const duration = useMusicStore((state) => state.duration)
    const changeDuration = useMusicStore((state) => state.changeDuration)

    // queue store
    const queue = useQueueStore((state) => state.queue)

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

        getTrackData()
    }

    const updatePosition = async (intervalId) => {
        if (soundObject) {
            const status = await soundObject.getStatusAsync()
            changePosition(status.positionMillis)
            changeDuration(status.durationMillis)

            // if currently playing song is completed
            if (status.positionMillis > status.durationMillis - 40) {
                if (queue.length !== 0) {
                    clearInterval(intervalId)
                    handleNextSong(queue.shift().id)
                } else {
                    clearInterval(intervalId)
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
            const intervalId = setInterval(
                () => updatePosition(intervalId),
                500
            )
            // Clean up the interval when the component unmounts
            return () => clearInterval(intervalId)
        }
    }, [soundObject, isPlaying])

    useEffect(() => {
        if (soundObject) {
            isPlaying ? play() : pause()
        }
    }, [isPlaying])

    return !soundObject ? null : (
        <Pressable
            style={{
                position: 'absolute',
                width: screenWidth - 20,
                left: 10,
                right: 10,
                height: 70,
                bottom: insets.bottom + 60,
                backgroundColor: '#303847',
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 10,
                display: currentPage === 'Track' ? 'none' : 'flex',
            }}
            onPress={() => {
                navigation.navigate('Track')
                changeCurrentPage('Track')
            }}
        >
            <Image style={{ width: 50, height: 50 }} src={songInfo.coverUrl} />
            <View
                aria-label='text and bar'
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    height: '100%',
                    paddingLeft: 10,
                    justifyContent: 'space-around',
                }}
            >
                <View
                    aria-label='text and play button box'
                    style={{ display: 'flex', flexDirection: 'row' }}
                >
                    <View
                        aria-label='text box'
                        style={{
                            display: 'flex',
                            width: '90%',
                        }}
                    >
                        <MediumText
                            numberOfLines={1}
                            ellipsizeMode='tail'
                            style={{
                                color: 'white',
                                fontSize: 14,
                            }}
                        >
                            {songInfo.songTitle}
                        </MediumText>
                        <LightText
                            style={{ color: COLORS.light, fontSize: 12 }}
                        >
                            {songInfo.songArtist}
                        </LightText>
                    </View>
                    <TouchableOpacity
                        style={{ paddingHorizontal: 5 }}
                        onPress={() => {
                            changeIsPlaying(!isPlaying)
                        }}
                    >
                        {/* update state for pause and play */}
                        {!isPlaying ? (
                            <Ionicons
                                name='play'
                                size={24}
                                color={COLORS.white}
                            />
                        ) : (
                            <Ionicons
                                name='pause'
                                size={24}
                                color={COLORS.white}
                            />
                        )}
                    </TouchableOpacity>
                </View>
                <SongProgessBar
                    currentTime={position}
                    duration={duration - 39}
                />
            </View>
        </Pressable>
    )
}
