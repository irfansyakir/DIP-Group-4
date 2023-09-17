import React from 'react'
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
import { useProfileStore } from '../../Store/useProfileStore'

export const Profile = () => {
  const navigation = useNavigation() // Initialize navigation
  const handleButtonClick = () => {
    navigation.navigate('EditProfile')
  }
  const handleContainerClick = () => {
    // Navigate to "YourNewPage" screen when the container is clicked
    navigation.navigate('Home')
  }
  const handleSeeAllClick = () => {
    // Navigate to "YourNewPage" screen when the container is clicked
    navigation.navigate('Home')
  }
  const displayName = useProfileStore((state) => state.displayName)
  const followers = useProfileStore((state) => state.followers)
  const profileUrl = useProfileStore((state) => state.profileUrl)

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
              <Text style={styles.columnBoldText}>23</Text>
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
          <TouchableOpacity onPress={handleContainerClick}>
            {renderTableRow(
              require('../../../assets/playlist1.png'),
              'Vibing',
              '7 likes'
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleContainerClick}>
            {renderTableRow(
              require('../../../assets/playlist2.png'),
              'Roadtrip',
              '4 likes'
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleContainerClick}>
            {renderTableRow(
              require('../../../assets/playlist3.png'),
              'Study',
              '5 likes'
            )}
          </TouchableOpacity>
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
