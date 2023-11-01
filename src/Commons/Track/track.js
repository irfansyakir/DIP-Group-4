import React, {useEffect} from 'react'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useFonts } from 'expo-font'
import { createIconSetFromIcoMoon } from '@expo/vector-icons'
import { Play } from './play'
import { useMusicStore } from '../../Store/useMusicStore'
import { BackgroundImage } from '@rneui/base'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS } from '../../Constants'

const Icon = createIconSetFromIcoMoon(
  require('../../../assets/icomoon/selection.json'),
  'IcoMoon',
  'icomoon.ttf'
)

export const Track = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const songInfo = useMusicStore((state) => state.songInfo)
  const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)
  useEffect(() => {
    return () => changeCurrentPage("Not Track")
  }, [])

  const [fontsLoaded] = useFonts({
    IcoMoon: require('../../../assets/icomoon/icomoon.ttf'),
  })

  if (!fontsLoaded) {
    return null
  }


  return (
    <View style={{
      flex: 1,
      backgroundColor: COLORS.dark,
    }}>
      <BackgroundImage style={{flex:1}} src={songInfo.coverUrl} blurRadius={90}>
      <LinearGradient
        colors={['#121212', 'transparent']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        locations={[0.3, 1]}
        style={{
          flex: 1,
          alignItems: 'center',
          }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems:'center',paddingTop: insets.top,}}>
          {/* TOP BAR */}
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 'auto',
            width: '90%',
            marginTop: 15,}}
          >
            <TouchableOpacity
              onPress={() => {
                changeCurrentPage(navigation.pop())
              }}
            >
              <Icon style={{color: '#FFF'}} name='down' size={20} />
            </TouchableOpacity>

            <Text style={{color: '#FFF',
              /* Heading 3 */
              fontSize: 14,
              fontWeight: 'bold',
              width: 250,
              textAlign: 'center',
              textShadowColor: COLORS.dark,
              textShadowOffset: {height: 1},
              textShadowRadius: 3,
              maxHeight: 30,}}>{songInfo.songAlbum}</Text>

            <TouchableOpacity 
              onPress={() => {
                changeCurrentPage(navigation.navigate('SearchClick'))
              }}
            >
              <Icon style={{color: '#FFF'}} name='more' size={25} />
            </TouchableOpacity>
          </View>

          <Image 
          style={{
            width: '90%',
            aspectRatio: 1,
            borderRadius: 10,
            marginTop: 20,}} 
            src={songInfo.coverUrl} />

          {/* TITLE, DESC, QUEUE BUTTON */}
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: 350,}}
          >
            <View>
              <Text style={{
                color: '#FFF',
                marginTop: 30,
                /* Heading 1 */
                fontSize: 25,
                fontWeight: 'bold',}}>{songInfo.songTitle}</Text>
              <Text style={{
                color: '#B3B3B3',
                marginTop: 5,
                marginBottom: 7,
                /* Body 3 */
                fontSize: 15,}}>{songInfo.songArtist}</Text>
            </View>
            <TouchableOpacity onPress={() => console.log('queue')}>
              <Icon
                style={{
                  color: '#FFF',
                  marginRight: 10,
                  marginTop: 15,}}
                name='viewqueue'
                size={33}
              />
            </TouchableOpacity>
          </View>
          
          {/* SLIDER, PLAY BUTTON */}
          <Play />

          {/* LYRICS */}
          <View style={{
            height: 'auto',
            width: '95%',
            backgroundColor: '#333',
            borderRadius: 10,
            padding: 30,
            paddingBottom: 40,
            marginBottom: 100,}}
          >
            <Text style={{
              color: '#FFF',
              /* Heading 2 */
              fontSize: 17,
              fontWeight: 'bold',}}>Lyrics</Text>
            <Text style={{
              color: '#FFF',
              fontSize: 16,
              marginTop: 25,
              lineHeight: 25,}}
            >
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum."
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
      </BackgroundImage>
    </View>
  )
}
