import { View, Image, TouchableOpacity } from 'react-native'
import { Dimensions } from 'react-native'
import { BoldText, MediumText } from './styledText'
import { COLORS } from '../../Constants'
import Ionicons from '@expo/vector-icons/Ionicons'

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

export function CurrentlyPlaying({
  coverUrl,
  title,
  artist,
  duration,
  currentTime,
}) {
  const screenWidth = Dimensions.get('window').width
  return (
    <View
      style={{
        position: 'absolute',
        width: screenWidth - 20,
        left: 10,
        right: 10,
        height: 70,
        bottom: 100,
        backgroundColor: '#303847',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}
    >
      <Image style={{ width: 50, height: 50 }} src={coverUrl} />
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
            <BoldText style={{ color: 'white' }}>{title}</BoldText>
            <MediumText style={{ color: COLORS.light, fontSize: 12 }}>
              {artist}
            </MediumText>
          </View>
          <TouchableOpacity onPress={() => {}}>
            {/* update state for pause and play */}
            {true ? (
              <Ionicons name='play' size={24} color={COLORS.white} />
            ) : (
              <Ionicons name='pause' size={24} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>
        <SongProgessBar currentTime={currentTime} duration={duration} />
      </View>
    </View>
  )
}
