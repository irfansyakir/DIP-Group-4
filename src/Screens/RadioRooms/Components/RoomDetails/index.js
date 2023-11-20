import React, { useEffect, useState } from 'react'
import {
    Image,
    Text,
    View,
    FlatList,
    Switch,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert,
} from 'react-native'
// import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker'
import { useNavigation, StackActions } from '@react-navigation/native' // Import useNavigation
import { LinearGradient } from 'expo-linear-gradient'
import { room_updateDJ, room_updateRoom } from '../../../../Utilities/Firebase/room_functions'
import clouds from '../../../../../assets/themes/clouds.png'
import raindrops from '../../../../../assets/themes/raindrops.png'
import palmTrees from '../../../../../assets/themes/palmtrees.png'

import { Ionicons } from '@expo/vector-icons'
import { COLORS, SIZES } from '../../../../Constants'
import { BoldText, MediumText } from '../../../../Commons/UI/styledText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { room_getRoom } from '../../../../Utilities/Firebase/room_functions'
import { room_removeUser } from '../../../../Utilities/Firebase/room_functions'
import { room_removeRoom } from '../../../../Utilities/Firebase/room_functions'
import { useAuthStore } from '../../../../Store/useAuthStore'
import {
    current_track_getCurrentTrack,
    current_track_removeFromRoom,
    current_track_updateCurrentTrack,
} from '../../../../Utilities/Firebase/current_track_functions'
import { message_removeAllMessageInRoom } from '../../../../Utilities/Firebase/messages_functions'
import { useMusicStore } from '../../../../Store/useMusicStore'
import { CheckBox, Overlay } from '@rneui/base'

export const RoomDetails = ({ route }) => {
    const navigation = useNavigation() // Initialize navigation
    //can just make this page look like the telegram room details
    const { roomID } = route.params
    const userID = useAuthStore((state) => state.userId)
    const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)
    const [isOwner, setIsOwner] = useState(false)

    // const { roomName, roomUserIDList, roomDJIDList } = route.params;
    const [roomName, setRoomName] = useState('')
    const [roomDescription, setRoomDescription] = useState('')
    const [roomThemeImgURL, setRoomThemeImgURL] = useState('')
    const [roomUserList, setRoomUserList] = useState({})

    const [roomProfileUrlList, setRoomProfileUrlList] = useState([])
    const [roomDJIDList, setRoomDJIDList] = useState([])
    const [roomDJProfileUrlList, setRoomDJProfileUrlList] = useState([])
    const insets = useSafeAreaInsets()

    useEffect(() => {
        getRoomDetails()
    }, [])

    const deleteRoom = async () => {
        await room_removeRoom({ roomID: roomID })
        await current_track_removeFromRoom({ roomID: roomID })
        await message_removeAllMessageInRoom({ roomID: roomID })

        navigation.navigate('Home', { screen: 'HomeTab' })
    }

    // leave room
    const handleButtonClick = () => {
        if (!isOwner) {
            room_removeUser({
                roomID: roomID,
                userID: userID,
            })
            navigation.navigate('Home', { screen: 'HomeTab' })
        } else {
            Alert.alert(
                'Alert',
                'You are currently the owner of this room, leaving the room will delete this room.',
                [
                    { text: 'Leave and Delete', onPress: () => deleteRoom() },
                    { text: 'Cancel', onPress: () => console.log('Canceled') },
                ]
            )
        }
    }

    const handleBackClick = () => {
        changeCurrentPage('Chatroom')
        navigation.dispatch(StackActions.pop(1))
    }

    const getRoomDetails = async () => {
        const roomDetails = await room_getRoom({ roomID: roomID })
        // console.log(roomDetails)
        if (!roomDetails) return
        setRoomName(roomDetails['room_name'])
        setRoomUserList(roomDetails['users'])
        setRoomDescription(roomDetails['room_description'])
        let tempImg = roomDetails['themeImageUrl'].toLowerCase()
        switch (tempImg) {
            case 'clouds':
                setRoomThemeImgURL(clouds)
                break
            case 'palmtrees':
                setRoomThemeImgURL(palmTrees)
                break
            case 'raindrops':
                setRoomThemeImgURL(raindrops)
                break
        }
        //every room MUST have a minimum of 1 user (that is the creator)
        //setRoomUserIDList(roomDetails["users"] ? roomDetails["users"] : [])

        //roomUserIDList
        //ignore

        //setRoomProfileURL
        //ignore this one

        //setRoomDJIDList
        // console.log(roomUserIDList)
        setRoomDJIDList(roomDetails['dj'] ? roomDetails['dj'] : [])

        //setRoomDJProfileURLList
        //ignore this one

        // setIsOwner
        setIsOwner(roomDetails['users'][userID]['owner'])
    }

    const [overlayVisible, setoverlayVisible] = useState(false)

    const toggleOverlay = () => {
        setoverlayVisible((prevState) => !prevState)
        room_updateDJ({ roomID: roomID, djArray: roomDJIDList })
    }

    const handleAddDJButton = () => {
        toggleOverlay()
    }

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
                    onPress={handleBackClick}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                    <Ionicons name='chevron-back' size={30} color={COLORS.grey} />
                </TouchableOpacity>

                <ScrollView>
                    <Image style={styles.image} source={roomThemeImgURL} />

                    <BoldText style={{ color: COLORS.light, fontSize: 25, alignSelf: 'center' }}>
                        {roomName}
                    </BoldText>

                    <Text style={{ color: COLORS.light, fontSize: 15, alignSelf: 'center' }}>
                        {roomDescription}
                    </Text>

                    <View>
                        <BoldText
                            style={{
                                color: COLORS.light,
                                fontSize: 15,
                                paddingVertical: 6,
                                marginLeft: 10,
                            }}
                        >
                            DJs:
                        </BoldText>
                    </View>
                    {roomDJIDList &&
                        roomDJIDList.map((djid) => {
                            if (!roomUserList) return
                            for (const [key, value] of Object.entries(roomUserList)) {
                                // console.log(key)
                                if (key === djid)
                                    return (
                                        <MediumText
                                            style={{
                                                color: COLORS.light,
                                                fontSize: 15,
                                                paddingVertical: 6,
                                                marginLeft: 10,
                                                paddingLeft: 2,
                                            }}
                                        >
                                            - {value['username']}
                                        </MediumText>
                                    )
                            }
                            return null
                        })}

                    <View>
                        <BoldText
                            style={{
                                color: COLORS.light,
                                fontSize: 15,
                                paddingVertical: 6,
                                marginLeft: 10,
                                marginTop: 40,
                            }}
                        >
                            Users:
                        </BoldText>
                    </View>

                    {roomUserList &&
                        Object.keys(roomUserList).map((id) => {
                            for (const [key, value] of Object.entries(roomUserList)) {
                                if (key === id)
                                    return (
                                        <MediumText
                                            style={{
                                                color: COLORS.light,
                                                fontSize: 15,
                                                paddingVertical: 6,
                                                marginLeft: 10,
                                                paddingLeft: 2,
                                            }}
                                        >
                                            - {value['username']}
                                        </MediumText>
                                    )
                            }
                            return null
                        })}

                    <TouchableOpacity
                        style={{
                            marginTop: 30,
                            backgroundColor: COLORS.primary,
                            borderRadius: 50,
                            width: '75%',
                            height: 45,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                        }}
                        onPress={handleButtonClick}
                    >
                        <BoldText style={{ color: COLORS.darkbluesat, fontSize: SIZES.medium }}>
                            Leave Group
                        </BoldText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            marginTop: 30,
                            backgroundColor: COLORS.primary,
                            borderRadius: 50,
                            width: '75%',
                            height: 45,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                        }}
                        onPress={handleAddDJButton}
                    >
                        <BoldText style={{ color: COLORS.darkbluesat, fontSize: SIZES.medium }}>
                            Edit DJ
                        </BoldText>
                    </TouchableOpacity>

                    <Overlay
                        isVisible={overlayVisible}
                        onBackdropPress={toggleOverlay}
                        overlayStyle={{
                            height: 500,
                            width: 350,
                            backgroundColor: COLORS.dark,
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: 20,
                        }}
                    >
                        <ScrollView
                            style={{
                                marginVertical: 50,
                            }}
                        >
                            <BoldText
                                style={{
                                    color: COLORS.light,
                                    fontSize: 18,
                                    marginBottom: 20,
                                }}
                            >
                                Update DJ access to the room:
                            </BoldText>
                            {roomUserList &&
                                Object.keys(roomUserList).map((id) => {
                                    //map over all roomUserList objects
                                    for (const [currUserID, value] of Object.entries(
                                        roomUserList
                                    )) {
                                        if (currUserID === id && value['owner'] !== true)
                                            return (
                                                <View
                                                    style={{
                                                        display: 'flex',
                                                        backgroundColor: COLORS.dark,
                                                        flexDirection: 'row',
                                                        // justifyContent: 'center',
                                                        alignItems: 'center',
                                                        paddingRight: 20,
                                                    }}
                                                >
                                                    <CheckBox
                                                        checked={roomDJIDList.includes(currUserID)}
                                                        onPress={() => {
                                                            if (roomDJIDList.includes(currUserID)) {
                                                                let temp = roomDJIDList
                                                                temp = temp.filter(
                                                                    (i) => i !== currUserID
                                                                )
                                                                setRoomDJIDList(temp)
                                                            } else {
                                                                setRoomDJIDList((prevState) => [
                                                                    ...prevState,
                                                                    currUserID,
                                                                ])
                                                            }
                                                        }}
                                                        containerStyle={{
                                                            backgroundColor: COLORS.dark,
                                                        }}
                                                        checkedColor={COLORS.primary}
                                                    />
                                                    <MediumText style={{ color: 'white' }}>
                                                        {value['username']}
                                                    </MediumText>
                                                </View>
                                            )
                                    }
                                    return null
                                })}
                        </ScrollView>
                    </Overlay>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}
export const styles = StyleSheet.create({
    image: {
        width: 120,
        height: 120,
        borderRadius: 20,
        marginBottom: 25,
        alignSelf: 'center',
    },
    header: {
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 10,
        marginVertical: 5,
        justifyContent: 'left',
        flexDirection: 'row',
    },
    header1: {
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 10,
        marginVertical: 5,
        justifyContent: 'left',
        flexDirection: 'row',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
    },
    text: {
        color: COLORS.dark,
        fontSize: 15,
        marginLeft: 10,
    },
    profileImage: {
        width: 50, // Adjust the width as needed
        height: 50, // Adjust the height as needed
        marginRight: 10, // Add margin to separate image and text
    },
})
