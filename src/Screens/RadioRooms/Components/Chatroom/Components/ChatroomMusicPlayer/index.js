import {Text, View, StyleSheet, Image, TouchableOpacity, Pressable, Dimensions} from "react-native";
import React from "react";
import {LightText, MediumText} from "../../../../../../Commons/UI/styledText";
import {COLORS} from "../../../../../../Constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useMusicStore} from "../../../../../../Store/useMusicStore";
import {useNavigation} from "@react-navigation/native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {GetTrack} from "../../../../../../Utilities/SpotifyApi/Utils";
import {useAuthStore} from "../../../../../../Store/useAuthStore";
import {Audio} from "expo-av";

const SongProgressBar = ({ currentTime, duration }) => {
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
export const ChatroomMusicPlayer = ({roomID, roomIsCurrentTrackPlaying, roomCurrentTrackID}) => {
  const screenWidth = Dimensions.get('window').width
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  const accessToken = useAuthStore((state) => state.accessToken)

  // -------------------------------------------------------------------------------------------------Copy of currentlyPlaying

  const songInfo = useMusicStore((state) => state.songInfo)
  const isPlaying = useMusicStore((state) => state.isPlaying)
  const soundObject = useMusicStore((state) => state.soundObject)
  const changeSoundObject = useMusicStore((state) => state.changeSoundObject)
  const changeIsPlaying = useMusicStore((state) => state.changeIsPlaying)
  const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)
  const position = useMusicStore((state) => state.position)
  const changePosition = useMusicStore((state) => state.changePosition)
  const duration = useMusicStore((state) => state.duration)
  const changeDuration = useMusicStore((state) => state.changeDuration)

  const changeSongInfo = useMusicStore((state) => state.changeSongInfo)

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
          trackData.album.name
        )
        await createSoundObject(trackData.preview_url)
      } catch (err) {
        console.error(err)
      }
    }

    getTrackData()
  }

  return(
    <View style={{
      display: "flex",
      backgroundColor: 'red'
    }}>
      <Pressable
        style={{
          width: screenWidth - 20,
          // left: 10,
          // right: 10,
          height: 100,
          // bottom: insets.bottom + 60,
          backgroundColor: '#303847',
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 10,
          display: 'flex',
        }}
        // onPress={() => {
        //   // console.log(currentPage)
        //   navigation.navigate('Track')
        //   changeCurrentPage('Track')
        // }}
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
          <SongProgressBar
            currentTime={position}
            duration={duration - 39}
          />
        </View>
      </Pressable>
    </View>
  )
}