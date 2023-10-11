import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native' // Import useNavigation
import { GetUserPlaylists } from '../../Utilities/SpotifyApi/Utils'
import { useAuthStore } from '../../Store/useAuthStore'
import { useProfileStore } from '../../Store/useProfileStore'
import { GetCurrentUserProfile } from '../../Utilities/SpotifyApi/Utils'

export const Profile = () => {
  const navigation = useNavigation() // Initialize navigation
  const changeDisplayName = useProfileStore((state) => state.changeDisplayName)
  const changeProfileUrl = useProfileStore((state) => state.changeProfileUrl)
  const changeFollowers = useProfileStore((state) => state.changeFollowers)
  const storeDisplayName = useProfileStore((state) => state.displayName)
  const handleButtonClick = () => {
    navigation.navigate('EditProfile')
  }
  const handlePlaylistClick = (playlistId) => {
    // Navigate to "YourNewPage" screen when the container is clicked
    const params = { playlistId: playlistId }
    navigation.navigate('Track', params)
  }
  const handleSeeAllClick = () => {
    // Navigate to "YourNewPage" screen when the container is clicked
    navigation.navigate('Home')
  }

  // retrieve state data from stores
  const accessToken = useAuthStore((state) => state.accessToken)

  // managing state for playlist
  const [playlists, setPlaylists] = useState([])
  const [totalPlaylist, setTotalPlaylist] = useState(0)
  const [displayName, setDisplayName] = useState('')
  const [followers, setFollowers] = useState(0)
  const [profileUrl, setProfileUrl] = useState('')

  const getPlaylistData = async () => {
    // fetch data on load
    try {
      const playlistData = await GetUserPlaylists({
        accessToken: accessToken,
        limit: 4,
      })
      setTotalPlaylist(playlistData.total)
      const playlistArray = []
      playlistData.items.map((playlist) => {
        playlistArray.push({
          id: playlist.id,
          coverUrl: playlist.images[0].url,
          name: playlist.name,
          owner: playlist.owner.display_name,
        })
      })
      setPlaylists(playlistArray)
    } catch (error) {
      console.error(error)
    }
  }

  const getInitialProfileData = async () => {
    // fetch data on load
    try {
      const profileData = await GetCurrentUserProfile({
        accessToken: accessToken,
      })
      setDisplayName(profileData.display_name)
      setFollowers(profileData.followers.total)
      setProfileUrl(profileData.images[1].url)
      changeDisplayName(profileData.display_name)
      changeFollowers(profileData.followers.total)
      changeProfileUrl(profileData.images[1].url)
      console.log(storeDisplayName)
      console.log('2')

    } catch (error) {
      console.error(error)
    }
  }

  const getChangedProfileData = async () => {
    // fetch data on load
    try {
      const profileData = await GetCurrentUserProfile({
        accessToken: accessToken,
      })
      console.log(storeDisplayName)
      setDisplayName(storeDisplayName)
      setFollowers(profileData.followers.total)
      setProfileUrl(profileData.images[1].url)
      console.log('3')

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (storeDisplayName == '') {
      console.log('get initial')
      getInitialProfileData()
    } else {
      console.log('get changed')
      getChangedProfileData()
    }
  }, [storeDisplayName])

  let callFunction = (e) => {
    setDisplayName(e)
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6369D1', '#42559E', '#101010']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.3, 0.6]}
        style={styles.background}
      />
      <ScrollView>
        <View style={styles.headerContainer}>
          <Image
            style={styles.profileImage}
            source={profileUrl}
            contentFit={'fill'}
          />
          <View style={styles.header}>
            <Text style={styles.headerText}>{displayName}</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.columnContainer}>
            <View style={styles.column}>
              <Text style={styles.columnBoldText}>{totalPlaylist}</Text>
              <Text style={styles.columnText}>PLAYLISTS</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.columnBoldText}>{followers}</Text>
              <Text style={styles.columnText}>FOLLOWERS</Text>
            </View>
            {/* <View style={styles.column}>
              <Text style={styles.columnBoldText}>43</Text>
              <Text style={styles.columnText}>FOLLOWING</Text>
            </View> */}
          </View>
        </View>
        <View>
          <Text style={styles.playlistText}>Playlists</Text>
        </View>
        <View style={styles.playlistContainer}>
          {playlists.map((playlist) => {
            return (
              <TouchableOpacity
                key={playlist.id}
                onPress={() => handlePlaylistClick(playlist.id)}
              >
                {renderTableRow(
                  playlist.coverUrl,
                  playlist.name,
                  playlist.owner
                )}
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={styles.seeAllContainer}>
          <TouchableOpacity onPress={handleSeeAllClick}>
            <Text style={styles.seeAllText}>See all playlists</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const renderTableRow = (imageSource, title, description) => (
  <View style={styles.tableRow}>
    <Image
      style={styles.playlistImage}
      source={imageSource}
      contentFit={'fill'}
    />
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  </View>
)

const styles = StyleSheet.create({
  seeAllContainer: {
    alignItems: 'left',
    marginLeft: 18,
    marginBottom: 50,
  },
  seeAllText: {
    textAlign: 'left',
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  playlistContainer: {
    marginTop: 15,
    flex: 1,
    alignItems: 'stretch',
    marginLeft: 18,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  playlistImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 13,
    color: '#B3B3B3',
  },
  columnContainer: {
    width: '100%',
    height: 70,
    flexDirection: 'row', // Arrange columns horizontally
    justifyContent: 'space-between', // Evenly space columns
  },
  column: {
    flex: 1, // Equal flex for all columns
    padding: 20, // Add padding to separate text from the edges
  },
  button: {
    marginTop: 15,
    backgroundColor: '#41BBC4',
    padding: 10,
    borderRadius: 50,
    width: 110,
    height: 40,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#181414',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  profileImage: {
    marginTop: 60,
    width: 120,
    height: 120,
    justifyContent: 'center',
    borderRadius: 100,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
  },
  header: {
    marginTop: 15,
    height: 20,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playlistText: {
    height: 32,
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 16,
  },
  columnText: {
    fontSize: 12,
    color: '#B3B3B3',
    textAlign: 'center',
  },
  columnBoldText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
