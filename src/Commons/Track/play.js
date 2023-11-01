// Music player bar used in track.js

import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useFonts } from 'expo-font'
import { createIconSetFromIcoMoon } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import { useMusicStore } from '../../Store/useMusicStore'

const Icon = createIconSetFromIcoMoon(
    require('../../../assets/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
)

export const Play = () => {
    const isPlaying = useMusicStore((state) => state.isPlaying)
    const changeIsPlaying = useMusicStore((state) => state.changeIsPlaying)
    const position = useMusicStore((state) => state.position)
    const duration = useMusicStore((state) => state.duration)
    const changePosition = useMusicStore((state) => state.changePosition)
    const soundObject = useMusicStore((state) => state.soundObject)
    const [localPosition, setLocalPosition] = useState(0)

    useEffect(() => {
        setLocalPosition(position)
    }, [position])

    const [fontsLoaded] = useFonts({
        IcoMoon: require('../../../assets/icomoon/icomoon.ttf'),
    })
    if (!fontsLoaded) {
        return null
    }

    const formatTime = (value) => {
        const totalSeconds = value / 1000
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = Math.round(totalSeconds % 60)
        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`
    }

    const togglePlay = () => {
        changeIsPlaying(!isPlaying)
    }

    const handleSlider = async (value) => {
        changePosition(value)
        await soundObject.setPositionAsync(value)
    }

    return (
        <View style={styles.container}>
            {/* SLIDER */}
            <Slider
                style={{ width: 350, height: 40, marginBottom: -5 }}
                minimumValue={0}
                maximumValue={duration}
                value={localPosition}
                onValueChange={(value) => setLocalPosition(value)}
                onSlidingComplete={(value) => handleSlider(value)}
                minimumTrackTintColor='#FFFFFF'
                maximumTrackTintColor='#777777'
                thumbTintColor='#FFF'
            />

            {/* NUMBERS */}
            <View style={styles.progress}>
                <Text style={styles.text}>{formatTime(localPosition)}</Text>
                <Text style={styles.text}>{formatTime(duration)}</Text>
            </View>

            {/* CONTROLS */}
            <View style={styles.controls}>
                <TouchableOpacity>
                    <Icon style={styles.icon} name='shuffle' size={25} />
                </TouchableOpacity>

                <TouchableOpacity>
                    <Icon style={styles.icon} name='back' size={30} />
                </TouchableOpacity>

                <TouchableOpacity onPress={togglePlay}>
                    <Icon
                        style={styles.icon}
                        name={isPlaying ? 'pause' : 'play'} // Set the name based on the state
                        size={65}
                    />
                </TouchableOpacity>

                <TouchableOpacity>
                    <Icon
                        style={[styles.icon, styles.rot]}
                        name='back'
                        size={30}
                    />
                </TouchableOpacity>

                <TouchableOpacity>
                    <Icon
                        style={[styles.icon, styles.rot]}
                        name='repeat'
                        size={25}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 10,
    },
    progress: {
        width: 350,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        color: '#B2B2B2',
        fontSize: 12,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        paddingBottom: 35,
        paddingTop: 20,
    },
    icon: {
        color: '#FFF',
    },
    rot: {
        transform: [{ rotateY: '180deg' }],
    },
})
