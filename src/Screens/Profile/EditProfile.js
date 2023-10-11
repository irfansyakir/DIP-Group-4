import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useAuthStore } from '../../Store/useAuthStore'
import { useProfileStore } from '../../Store/useProfileStore'
import { GetCurrentUserProfile } from '../../Utilities/SpotifyApi/Utils'

export const EditProfile = () => {
  const [text, onChangeText] = React.useState('')
  const navigation = useNavigation() // Initialize navigation
  const changeIsLoggedIn = useAuthStore((state) => state.changeIsLoggedIn)
  const changeDisplayName = useProfileStore((state) => state.changeDisplayName)
  const storeDisplayName = useProfileStore((state) => state.displayName)

  const handleButtonClick = () => {
    navigation.navigate('ProfileTab')
  }
  const handleContainerClick = () => {
    // Navigate to "YourNewPage" screen when the container is clicked
    // navigation.navigate('Home');
    changeIsLoggedIn(false)
  }
  const handleNameClick = () => {
    changeDisplayName(displayName)
    navigation.navigate('ProfileTab')
  }
    // retrieve state data from stores
  const accessToken = useAuthStore((state) => state.accessToken)

    // managing state for playlist
  const [displayName, setDisplayName] = useState('')
  const [profileUrl, setProfileUrl] = useState('')

  const getInitialProfileData = async () => {
    // fetch data on load
    try {
      const profileData = await GetCurrentUserProfile({
        accessToken: accessToken,
      })
      if (storeDisplayName == profileData.display_name) {
        setDisplayName(profileData.display_name)
        setProfileUrl(profileData.images[1].url)
        console.log('1')
      } else {
        setDisplayName(storeDisplayName)
        setProfileUrl(profileData.images[1].url)
        console.log('0')
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getInitialProfileData()
  }, [])

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
      <View style={styles.header}>
        <TouchableOpacity style={styles.buttonBack} onPress={handleButtonClick}>
          <Image
            style={styles.backImage}
            source={require('../../../assets/Backbutton.png')}
            contentFit={'fill'}
          />
        </TouchableOpacity>
        <Text style={styles.profileText}>Edit Profile</Text>
      </View>
      <View style={styles.body}>
        <ScrollView>
          <Text style={styles.nameText}>{displayName}</Text>
          <Image
            style={styles.profileImage}
            source={profileUrl}
            contentFit={'fill'}
          />
          <View>
            <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
              <Text style={styles.buttonText}>Change photo</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.boldText}>Edit username</Text>
          <TextInput
            style={styles.input}
            onChangeText={callFunction}
            value={displayName}
            placeholder='Type a new username...'
          />
          <View>
          <TouchableOpacity
              style={styles.buttonLogout}
              onPress={handleNameClick}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonLogout}
              onPress={handleContainerClick}
            >
              <Text style={styles.buttonText}>Log out</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.emptyText}>Edit username</Text>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  profileImage: {
    marginTop: 30,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  backImage: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 80,
    marginSide: 20,
  },
  header: {
    backgroundColor: '#13151E',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 10,
    justifyContent: 'left',
    flexDirection: 'row',
  },
  body: {
    flex: 2,
    backgroundColor: '#13151E',
    paddingLeft: 10,
    paddingRight: 10,
  },
  boldText: {
    fontWeight: 'bold',
    color: 'white',
    paddingLeft: 15,
    fontSize: 18,
    paddingTop: 20,
  },
  nameText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 50,
    alignSelf: 'center',
  },
  profileText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 110,
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'slategrey',
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#41BBC4',
    borderRadius: 50,
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonLogout: {
    marginTop: 30,
    backgroundColor: '#41BBC4',
    borderRadius: 50,
    width: 300,
    height: 45,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonBack: {
    marginTop: 10,
    backgroundColor: '#13151E',
    borderRadius: 50,
    width: 40,
    height: 40,
    paddingLeft: 0,
  },
  buttonText: {
    color: '#181414',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontWeight: 'bold',
    color: '#13151E',
    paddingLeft: 15,
    fontSize: 18,
  },
})
