import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { COLORS } from '../../Constants'
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { GetRecentlyPlayed } from '../../Utilities/SpotifyApi/Utils'
import { GetUserPlaylists } from '../../Utilities/SpotifyApi/Utils'
import { useAuthStore } from '../../Store/useAuthStore'
//Danish's Home Page
//Needs testing first

//Todo
//0. Fix Flatlist inside Scrollview
//1. Put code inside the View component w/ insets
//2. Put the playlists as parameters
//3. Implement lazy loading w/ the recommendedPlaylists (so home page not so empty)
//    a. Fetch most recent RadioRoom playlists from our database
//    b. Lazy load when the recc. part is on display (use https://medium.com/swlh/lazy-loading-with-react-native-62cfe03986a4 as source)

export const Home = () => {
  const insets = useSafeAreaInsets()
  const accessToken = useAuthStore((state) => state.accessToken)
  const [recentlyPlayed, setRecentlyPlayed] = useState([])
  const [playlists, setPlaylists] = useState([])

  const getRecentlyPlayed = async () => {
    try {
      const recentlyPlayedData = await GetRecentlyPlayed({
        accessToken: accessToken,
        limit: 5,
      })
      const currRecentlyPlayed = []
      recentlyPlayedData.items.map((curr) => {
        currRecentlyPlayed.push({
          id: curr.track.id,
          title: curr.track.name,
          photoUrl: curr.track.album.images[0].url,
        })
      })
      setRecentlyPlayed(currRecentlyPlayed)
    } catch (err) {
      console.error(err)
    }
  }

  const getPlaylistData = async () => {
    // fetch data on load
    try {
      const playlistData = await GetUserPlaylists({
        accessToken: accessToken,
      })
      const playlistArray = []
      playlistData.items.map((playlist) => {
        playlistArray.push({
          id: playlist.id,
          photoUrl: playlist.images[0].url,
          name: playlist.name,
          owner: playlist.owner.display_name,
          total: playlist.tracks.total,
        })
      })
      setPlaylists(playlistArray)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getRecentlyPlayed()
    getPlaylistData()
  }, [])

  // Sample data for songs and playlists
  const recommendedSongs = [
    { id: '1', name: 'Song 1', artist: 'Artist One' },
    { id: '2', name: 'Song 2', artist: 'Artist Two' },
    { id: '3', name: 'Song 3', artist: 'Artist Three' },
    { id: '4', name: 'Song 4', artist: 'Artist Four' },
    { id: '5', name: 'Song 5', artist: 'Artist Five' },
    { id: '6', name: 'Song 6', artist: 'Artist Six' },
    { id: '7', name: 'Song 7', artist: 'Artist Seven' },
  ]

  const recommendedPlaylists = [
    { id: '1', name: 'Playlist 1', songs: 10 },
    { id: '2', name: 'Playlist 2', songs: 3 },
    { id: '3', name: 'Playlist 3', songs: 21 },
    { id: '4', name: 'Playlist 4', songs: 19 },
    { id: '5', name: 'Playlist 5', songs: 17 },
    { id: '6', name: 'Playlist 6', songs: 9 },
    { id: '7', name: 'Playlist 7', songs: 8 },
  ]
  return (
    <View
      style={{
        paddingTop: insets.top, // Add top inset as padding
        paddingBottom: insets.bottom, // Add bottom inset as padding
        flex: 1, // Make sure the content fills the available space
        backgroundColor: COLORS.dark, // Adjust background color as needed
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ScrollView style={{ flex: 1, marginTop: 20 }}>
        <View>
          <Text
            style={{
              color: 'white',
              marginHorizontal: 10,
              fontSize: 17,
              fontWeight: 'bold',
              marginVertical: 10,
            }}
          >
            Recently Played
          </Text>
        </View>

        <FlatList
          style={{ marginHorizontal: 10 }}
          horizontal={true}
          data={recentlyPlayed}
          keyExtractor={() => Math.random() * 10}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  marginRight: 10,
                }}
                src={item.photoUrl}
              />

              <View>
                <Text
                  numberOfLines={1}
                  style={{ fontWeight: '400', fontSize: 10, color: 'white' }}
                >
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <View
          style={{
            marginTop: 10,
            marginBottom: 5,
            borderBottomColor: COLORS.black,
            borderBottomWidth: 5,
          }}
        />

        <View>
          <Text
            style={{
              fontSize: 17,
              color: 'white',
              fontWeight: 'bold',
              marginHorizontal: 10,
              marginVertical: 15,
            }}
          >
            Playlists
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              width: 55,
              height: 50,
              // width:50,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 10,
              backgroundColor: '#595861',
            }}
          >
            <AntDesign name='plus' size={24} color='white' />
          </TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>
            Create Playlist
          </Text>
        </View>

        <FlatList
          data={playlists}
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
                src={item.photoUrl}
              />

              <View>
                <Text
                  numberOfLines={1}
                  style={{ fontWeight: '400', fontSize: 16, color: 'white' }}
                >
                  {item.name}
                </Text>
                <Text style={{ marginTop: 4, color: '#9A9A9A' }}>
                  {item.total} songs
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  )
}
