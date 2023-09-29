import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Feather, FontAwesome } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
//import AsyncStorage from "@react-native-async-storage/async-storage";
//import SongItem from "../components/SongItem";
//import { Player } from "../PlayerContext";
//import { BottomModal } from "react-native-modals";
//import { ModalContent } from "react-native-modals";
//import { Audio } from "expo-av";
//import { debounce } from "lodash";

export const Playlist = () => {
  const [input, setInput] = useState('')
  const insets = useSafeAreaInsets()

  // Sample data for song display
  const recommendedSongs = [
    { id: '1', name: 'Song 1', artist: 'Artist One' },
    { id: '2', name: 'Song 2', artist: 'Artist Two' },
    { id: '3', name: 'Song 3', artist: 'Artist Three' },
    { id: '4', name: 'Song 4', artist: 'Artist Four' },
    { id: '5', name: 'Song 5', artist: 'Artist Five' },
    { id: '6', name: 'Song 6', artist: 'Artist Six' },
    { id: '7', name: 'Song 7', artist: 'Artist Seven' },
    { id: '8', name: 'Song 8', artist: 'Artist Eight' }
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
        }}
      >
        <TouchableOpacity style={{ marginHorizontal: 10, marginBottom:10 }}>
          <Ionicons name='arrow-back' size={30} color='white' />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection:'row',
            backgroundColor: '#7E6E5B',
            height:38,
            alignItems:'center',
            gap:10,
            borderRadius:3,
            padding:9,
            
          }}
        >
          <AntDesign name='search1' size={20} color='white' />
          <TextInput
            value={input}
            onChangeText={(text) => setInput(text)}
            autoFocus={false}
            placeholder='Find in Playlist'
            placeholderTextColor={'white'}
            style={{ fontWeight: '400', color: 'white' }}
          />
        </TouchableOpacity>

        <View style={{ height: 50 }} />
        <View style={{ marginHorizontal: 10, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
            {' '}
            PLAYLIST NAME
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 14, color: 'white' }}>
            {' '}
            Insert Description{' '}
          </Text>

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
            <Entypo name='controller-play' size={24} color='black' />
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
