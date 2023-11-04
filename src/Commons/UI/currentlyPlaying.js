import { View, Image, TouchableOpacity, Pressable } from 'react-native'
import { Dimensions } from 'react-native'
import { LightText, MediumText } from './styledText'
import { COLORS } from '../../Constants'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useMusicStore } from '../../Store/useMusicStore'
import { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
    const songInfo = useMusicStore((state) => state.songInfo)
    const isPlaying = useMusicStore((state) => state.isPlaying)
    const soundObject = useMusicStore((state) => state.soundObject)
    const changeIsPlaying = useMusicStore((state) => state.changeIsPlaying)
    const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)
    const position = useMusicStore((state) => state.position)
    const changePosition = useMusicStore((state) => state.changePosition)
    const duration = useMusicStore((state) => state.duration)
    const changeDuration = useMusicStore((state) => state.changeDuration)
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

    const updatePosition = async (intervalId) => {
        if (soundObject) {
            const status = await soundObject.getStatusAsync()
            changePosition(status.positionMillis)
            changeDuration(status.durationMillis)

            if (status.positionMillis > status.durationMillis - 40) {
                clearInterval(intervalId)
                changeIsPlaying(false)
                await soundObject.setPositionAsync(0)
                changePosition(0)
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
                display: (currentPage === 'Track' || currentPage === 'Chatroom') ? 'none' : 'flex',
            }}
            onPress={() => {
                // console.log(currentPage)
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
                            flexGrow: 1,
                            display: 'flex',
                        }}
                    >
                        <MediumText style={{ color: 'white', fontSize: 14 }}>
                            {songInfo.songTitle}
                        </MediumText>
                        <LightText
                            style={{ color: COLORS.light, fontSize: 12 }}
                        >
                            {songInfo.songArtist}
                        </LightText>
                    </View>
                    <TouchableOpacity
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
