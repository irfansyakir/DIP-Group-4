import {
  FlatList,
  Image,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BoldText, MediumText } from '../UI/styledText'

export const Playlist = ({ route }) => {
  const [input, setInput] = useState('')
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const playlistID = route.params

  // Sample data for song display
  const recommendedSongs = [
    { id: '1', name: 'Song 1', artist: 'Artist One' },
    { id: '2', name: 'Song 2', artist: 'Artist Two' },
    { id: '3', name: 'Song 3', artist: 'Artist Three' },
    { id: '4', name: 'Song 4', artist: 'Artist Four' },
    { id: '5', name: 'Song 5', artist: 'Artist Five' },
    { id: '6', name: 'Song 6', artist: 'Artist Six' },
    { id: '7', name: 'Song 7', artist: 'Artist Seven' },
    { id: '8', name: 'Song 8', artist: 'Artist Eight' },
  ]

  return (
    <LinearGradient
      colors={['#836E55', '#4C4134', '#15120F']}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          marginTop: 20,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          marginHorizontal: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 15 }}
        >
          <Ionicons name='chevron-back' size={25} color='white' />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            backgroundColor: '#7E6E5B',
            height: 38,
            alignItems: 'center',
            gap: 10,
            borderRadius: 3,
            padding: 9,
          }}
        >
          <AntDesign name='search1' size={20} color='white' />
          <TextInput
            value={input}
            onChangeText={(text) => setInput(text)}
            autoFocus={false}
            placeholder='Find in Playlist'
            placeholderTextColor={'white'}
            style={{
              fontFamily: 'InterLight',
              fontSize: 12,
              color: 'white',
            }}
          />
        </TouchableOpacity>

        <View style={{ height: 50 }} />
        <View
          style={{
            marginHorizontal: 10,
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <BoldText style={{ color: 'white', fontSize: 18 }}>
            PLAYLIST NAME
          </BoldText>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <MediumText style={{ fontSize: 12, color: 'white' }}>
            Insert Description
          </MediumText>

          <TouchableOpacity
            style={{
              width: 55,
              height: 55,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 10,
              backgroundColor: '#41BBC4',
            }}
          >
            <Entypo name='controller-play' size={30} color='black' />
          </TouchableOpacity>
        </View>

        <FlatList
          data={recommendedSongs}
          horizontal={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
              }}
            >
              <Image
                style={{
                  width: 50,
                  height: 50,
                  marginRight: 10,
                }}
                source={{
                  uri: 'https://file-examples.com/storage/fe7bce3209650074f95baa0/2017/10/file_example_PNG_500kB.png',
                }}
              />

              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{ fontWeight: '400', fontSize: 16, color: 'white' }}
                >
                  {item.name}{' '}
                </Text>
                <Text style={{ marginTop: 4, color: '#9A9A9A' }}>
                  {item.artist}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 10,
                }}
              >
                <Entypo
                  name='dots-three-horizontal'
                  size={24}
                  color='#ABA4A3'
                />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </LinearGradient>
  )
}
