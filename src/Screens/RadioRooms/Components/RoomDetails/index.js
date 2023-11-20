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
import { room_updateRoom } from '../../../../Utilities/Firebase/room_functions'
import clouds from '../../../../../assets/themes/clouds.png'
import raindrops from '../../../../../assets/themes/raindrops.png'
import palmTrees from '../../../../../assets/themes/palmtrees.png'

import { Ionicons } from '@expo/vector-icons'
import { COLORS, SIZES } from '../../../../Constants'
import { BoldText } from '../../../../Commons/UI/styledText'
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
import palmtrees from '../../../../../assets/themes/palmtrees.png'
import { useMusicStore } from '../../../../Store/useMusicStore'

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
    const [roomUserIDList, setRoomUserIDList] = useState([])
    const [roomProfileUrlList, setRoomProfileUrlList] = useState([])
    const [roomDJIDList, setRoomDJIDList] = useState([])
    const [roomDJProfileUrlList, setRoomDJProfileUrlList] = useState([])
    const insets = useSafeAreaInsets()

    useEffect(() => {
        getRoomDetails().then()
        console.log('roomID: ', roomID)
        console.log('roomname: ', roomName)
        console.log('roomdescription: ', roomDescription)
        console.log('roomthemeURL: ', roomThemeImgURL)
        console.log('roomUserIDs: ', roomUserIDList)
        console.log('roomProfileUrls: ', roomProfileUrlList)
        console.log('roomDJs: ', roomDJIDList)
        console.log('roomDJProfileUrls: ', roomDJProfileUrlList)
    }, [])

    const deleteRoom = async () => {
        await room_removeRoom({ roomID: roomID })
        await current_track_removeFromRoom({ roomID: roomID })
        await message_removeAllMessageInRoom({ roomID: roomID })

        const popAction = StackActions.pop(2)
        navigation.dispatch(popAction)
    }

    // leave room
    const handleButtonClick = () => {
        if (!isOwner) {
            room_removeUser({
                roomID: roomID,
                userID: userID,
            })
            navigation.navigate('RadioRoom')
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
        console.log(roomDetails)
        setRoomName(roomDetails['room_name'])
        setRoomDescription(roomDetails['room_description'])
        let tempImg = roomDetails['themeImageUrl'].toLowerCase()
        switch (tempImg) {
            case 'clouds':
                setRoomThemeImgURL(clouds)
                break
            case 'palmtrees':
                setRoomThemeImgURL(palmtrees)
                break
            case 'raindrops':
                setRoomThemeImgURL(raindrops)
                break
        }
        //every room MUST have a minimum of 1 user (that is the creator)
        //setRoomUserIDList(roomDetails["users"] ? roomDetails["users"] : [])
        setRoomUserIDList(roomDetails['users']['username'] ? roomDetails['users']['username'] : [])
        setRoomProfileUrlList(
            roomDetails['users']['profileUrl'] ? roomDetails['users']['profileUrl'] : []
        )
        // console.log(roomUserIDList)
        setRoomDJIDList(roomDetails['dj']['username'] ? roomDetails['dj']['username'] : [])
        setRoomDJProfileUrlList(
            roomDetails['dj']['profileUrl'] ? roomDetails['dj']['profileUrl'] : []
        )

        // ownership testing
        console.log(typeof roomDetails['users'][userID]['owner'])
        setIsOwner(roomDetails['users'][userID]['owner'])
        console.log('isOwner: ' + roomDetails['users'][userID]['owner'])
        console.log('isOwnerState: ' + isOwner)
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
                        <Text
                            style={{
                                color: COLORS.light,
                                fontSize: 15,
                                paddingVertical: 6,
                                marginLeft: 10,
                            }}
                        >
                            DJs:
                        </Text>
                    </View>
                    <View style={styles.header}>
                        <FlatList
                            data={roomDJIDList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View style={styles.row} key={index}>
                                    <Image
                                        source={{ uri: roomDJProfileUrlList[index] }}
                                        style={styles.profileImage}
                                    />
                                    <Text style={styles.text}>{`${item}`}</Text>
                                </View>
                            )}
                        />
                    </View>
                    <View>
                        <Text
                            style={{
                                color: COLORS.light,
                                fontSize: 15,
                                paddingVertical: 6,
                                marginLeft: 10,
                            }}
                        >
                            Users:
                        </Text>
                    </View>
                    <View style={styles.header1}>
                        <FlatList
                            data={roomUserIDList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View style={styles.row} key={index}>
                                    <Image
                                        source={{ uri: roomProfileUrlList[index] }}
                                        style={styles.profileImage}
                                    />
                                    <Text style={styles.text}>{`${item}`}</Text>
                                </View>
                            )}
                        />
                    </View>

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
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        padding: 10,
        marginTop: 25,
        justifyContent: 'left',
        flexDirection: 'row',
    },
    header1: {
        backgroundColor: 'white',
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        padding: 10,
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
