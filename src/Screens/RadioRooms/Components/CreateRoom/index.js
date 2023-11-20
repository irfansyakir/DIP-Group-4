import React, { useEffect, useState } from 'react'
import {
    Image,
    Text,
    View,
    TextInput,
    Switch,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native'
// import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker'
import { useNavigation, StackActions } from '@react-navigation/native' // Import useNavigation
import { LinearGradient } from 'expo-linear-gradient'
import { room_updateRoom } from '../../../../Utilities/Firebase/room_functions'

import { Ionicons } from '@expo/vector-icons'
import { COLORS, SIZES } from '../../../../Constants'
import { BoldText } from '../../../../Commons/UI/styledText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useQueueStore } from '../../../../Store/useQueueStore'
import { useAuthStore } from '../../../../Store/useAuthStore'
import { useProfileStore } from '../../../../Store/useProfileStore'
import { useMusicStore } from '../../../../Store/useMusicStore'

import clouds from '../../../../../assets/themes/clouds.png'
import raindrops from '../../../../../assets/themes/raindrops.png'
import palmTrees from '../../../../../assets/themes/palmtrees.png'

export const CreateRoom = () => {
    const insets = useSafeAreaInsets()
    const [selectedIndex, setIndex] = React.useState(0)
    const [roomName, setRoomName] = useState('')
    const [roomDescription, setRoomDescription] = useState('')
    const [themeImageUrl, setThemeImageUrl] = useState('')
    const [uploadedImageUrl, setUploadedImageUrl] = useState('')
    const [isPublic, setIsPublic] = useState(false)
    const [isOthersAddSongs, setIsOthersAddSongs] = useState(false)

    const [isEnabled, setIsEnabled] = useState(false)
    const [isEnabled2, setIsEnabled2] = useState(false)

    const changeRole = useQueueStore((state) => state.changeRole)

    const userID = useAuthStore((state) => state.userId)
    const username = useProfileStore((state) => state.displayName)
    const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)
    const soundObject = useMusicStore((state) => state.soundObject)
    const resetPlayer = useMusicStore((state) => state.resetPlayer)

    const changeRadioRoom_roomId = useMusicStore((state) => state.changeRadioRoom_roomId)
    const changeRadioRoom_isDJ = useMusicStore((state) => state.changeRadioRoom_isDJ)

    //have no idea what this is meant to do but its in the original code soo ill just recreate it
    //use: toggleSwitch(setIsEnabled2) or toggleSwitch(setIsEnabled)
    const toggleSwitch = (callbackFunction) => {
        callbackFunction((previousState) => !previousState)
    }

    const [selectedChoice, setSelectedChoice] = useState(null)
    const handleChoiceClick = (choice) => {
        setSelectedChoice(choice)
        if (choice === 1) {
            setThemeImageUrl('clouds')
        } else if (choice === 2) {
            setThemeImageUrl('raindrops')
        } else if (choice === 3) {
            setThemeImageUrl('palmtrees')
        } else {
            setThemeImageUrl(uploadedImageUrl)
        }
    }

    //TODO: don't forget to implement this for the front end
    const handleImageClick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })
        if (!result.canceled) {
            setUploadedImageUrl(result.assets[0].uri)
        }
    }

    //TODO: Get userID here, and put it under users in room_updateRoom, since every room MUST have at least 1 user (it being the creator)
    //UserID can get from either profileStore (if its implemented) or spotify API prob.
    const handleStartListening = async () => {
        // console.log(roomName)
        if (roomName) {
            if (soundObject) {
                await soundObject.pauseAsync()
                await soundObject.unloadAsync()
                resetPlayer()
            }
            room_updateRoom({
                roomName: roomName,
                roomDescription: roomDescription,
                themeImageUrl: themeImageUrl,
                isPublic: isPublic,
                isOthersAddSongs: isOthersAddSongs,
                dj: [userID],
                users: {
                    [userID]: {
                        username: username,
                        owner: true,
                    },
                },
            }).then((roomID) => {
                changeRadioRoom_roomId(roomID)
                navigation.dispatch(
                    StackActions.replace('RoomQueue', { roomID: roomID, roomName: roomName })
                )
                changeRadioRoom_isDJ(true)
            })
        } else {
            console.log('no room name!')
        }
    }

    useEffect(() => {
        changeCurrentPage('CreateRoom')
        //isPublic and isOthersAddSongs used to be declared here. Don't do that pls. Declare changeable variables on top level instead (using useState)
    }, [])

    //debugging purposes
    // useEffect(() => {
    //   console.log("Data: ", roomName, roomDescription, themeImageUrl, isPublic, isOthersAddSongs)
    // }, [roomName, roomDescription, themeImageUrl, isPublic, isOthersAddSongs])

    const navigation = useNavigation() // Initialize navigation

    /*  const showMessage = () => {
        const customMessage = "You are about to leave the page.";
        Alert.alert(
          "Save Changes?",
          customMessage, // Set your custom message here
          [
            {
                text: "Yes",
                onPress: () => navigation.navigate('Profile'),
            },
            {
                text: "Cancel",
                onPress: () => console.log('No Pressed'),
            }
          ],
          { cancelable: true }
        );
      };
    const handleContainerClick = () => {
        // Navigate to "YourNewPage" screen when the container is clicked
        navigation.navigate('"Room"Room');
    };
*/
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'start',
                backgroundColor: COLORS.dark,
                paddingTop: insets.top,
                padding: 20,
            }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100} // Adjust the offset as needed
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                    <Ionicons name='chevron-back' size={30} color={COLORS.grey} />
                </TouchableOpacity>

                <BoldText style={{ color: COLORS.light, fontSize: 25, marginVertical: 10 }}>
                    Create Room
                </BoldText>

                <ScrollView>
                    <BoldText style={styles.subtitle}>Select a theme</BoldText>
                    <ScrollView horizontal={true} style={{ paddingBottom: 20 }}>
                        <TouchableOpacity
                            onPress={() => {
                                handleChoiceClick(1)
                            }}
                        >
                            <Image
                                style={selectedChoice === 1 ? styles.imagesel : styles.image}
                                source={clouds}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                handleChoiceClick(2)
                            }}
                        >
                            <Image
                                style={selectedChoice === 2 ? styles.imagesel : styles.image}
                                source={raindrops}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                handleChoiceClick(3)
                            }}
                        >
                            <Image
                                style={selectedChoice === 3 ? styles.imagesel : styles.image}
                                source={palmTrees}
                            />
                        </TouchableOpacity>
                    </ScrollView>

                    <BoldText style={styles.subtitle}>Room Name</BoldText>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => {
                            setRoomName(text)
                        }}
                        value={roomName}
                        placeholder='Type a room name...'
                        placeholderTextColor={COLORS.grey}
                    />
                    <BoldText style={styles.subtitle}>Room Description</BoldText>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => {
                            setRoomDescription(text)
                        }}
                        value={roomDescription}
                        placeholder='Type a room description...'
                        placeholderTextColor={COLORS.grey}
                    />

                    <BoldText style={styles.subtitle}>Settings</BoldText>

                    <View style={styles.settingview}>
                        <Text style={styles.setting}>Allow listeners to queue songs</Text>
                        <TouchableOpacity onPress={() => setIsOthersAddSongs(true)}>
                            <View style={styles.radioout}>
                                {isOthersAddSongs ? <View style={styles.radioin}></View> : null}
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.settingview}>
                        <Text style={styles.setting}>Invites only</Text>
                        <TouchableOpacity onPress={() => setIsOthersAddSongs(false)}>
                            <View style={styles.radioout}>
                                {!isOthersAddSongs ? <View style={styles.radioin}></View> : null}
                            </View>
                        </TouchableOpacity>
                    </View>

                    <BoldText style={styles.subtitle}>isPublic?</BoldText>

                    <View style={styles.settingview}>
                        <Text style={styles.setting}>yes</Text>
                        <TouchableOpacity onPress={() => setIsPublic(true)}>
                            <View style={styles.radioout}>
                                {isPublic ? <View style={styles.radioin}></View> : null}
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.settingview}>
                        <Text style={styles.setting}>no</Text>
                        <TouchableOpacity onPress={() => setIsPublic(false)}>
                            <View style={styles.radioout}>
                                {!isPublic ? <View style={styles.radioin}></View> : null}
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {/* Create Playlist Button */}
                <TouchableOpacity
                    style={{
                        marginTop: 30,
                        marginBottom: 30,
                        backgroundColor: COLORS.primary,
                        borderRadius: 50,
                        width: '75%',
                        height: 45,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                    }}
                    onPress={handleStartListening}
                >
                    <BoldText style={{ color: COLORS.darkbluesat, fontSize: SIZES.medium }}>
                        Create Playlist
                    </BoldText>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    )
}

export const styles = StyleSheet.create({
    subtitle: {
        color: COLORS.light,
        fontSize: SIZES.medium,
        marginTop: 10,
        marginBottom: 10,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 20,
        marginRight: 10,
    },
    imagesel: {
        width: 120,
        height: 120,
        borderRadius: 20,
        marginRight: 10,
        borderColor: COLORS.primary,
        borderWidth: 5,
    },
    input: {
        color: COLORS.light,
        fontSize: SIZES.sm,
        height: 40,
        padding: 10,
        backgroundColor: COLORS.darkgrey,
        borderRadius: 5,
        marginBottom: 15,
    },

    setting: {
        fontSize: SIZES.medium,
        color: COLORS.light,
    },
    settingview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        marginRight: 5,
    },
    radioout: {
        width: 35,
        height: 35,
        borderColor: COLORS.light,
        borderRadius: 20,
        borderWidth: 2.5,
    },
    radioin: {
        backgroundColor: COLORS.primary,
        height: 24,
        width: 24,
        margin: 3,
        borderRadius: 20,
    },
})
