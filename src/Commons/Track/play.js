// Music player bar used in track.js

import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useFonts } from 'expo-font'
import { createIconSetFromIcoMoon } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'

const Icon = createIconSetFromIcoMoon(
  require('../../../assets/icomoon/selection.json'),
  'IcoMoon',
  'icomoon.ttf'
)

export const Play = ({ handlePlay, handlePause }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [range, setRange] = useState('0')
  const maxTime = 5

  const [fontsLoaded] = useFonts({
    IcoMoon: require('../../../assets/icomoon/icomoon.ttf'),
  })
  if (!fontsLoaded) {
    return null
  }

  const formatTime = (value) => {
    const totalSeconds = value * maxTime * 60
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.round(totalSeconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  }

  const togglePlay = () => {
    if (isPlaying) handlePause()
    else handlePlay()
    setIsPlaying(!isPlaying)
  }

  return (
    <View style={styles.container}>
      {/* SLIDER */}
      <Slider
        style={{ width: 350, height: 40, marginBottom: -5 }}
        minimumValue={0}
        maximumValue={1}
        value={range}
        onValueChange={(value) => setRange(value)}
        minimumTrackTintColor='#FFFFFF'
        maximumTrackTintColor='#777777'
        thumbTintColor='#FFF'
      />

      {/* NUMBERS */}
      <View style={styles.progress}>
        <Text style={styles.text}>{formatTime(range)}</Text>
        <Text style={styles.text}>{formatTime(1)}</Text>
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
          <Icon style={[styles.icon, styles.rot]} name='back' size={30} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Icon style={[styles.icon, styles.rot]} name='repeat' size={25} />
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
