import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
    ScrollView,
    Dimensions,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useAuthStore } from '../../Store/useAuthStore'
import { useQueueStore } from '../../Store/useQueueStore'
import {
    room_addUser,
    room_getAllRooms,
    room_removeRoom,
} from '../../Utilities/Firebase/room_functions'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BoldText } from '../../Commons/UI/styledText'
import { COLORS, SIZES } from '../../Constants'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useMusicStore } from '../../Store/useMusicStore'
import { useProfileStore } from '../../Store/useProfileStore'

export const RadioRooms = () => {
    const insets = useSafeAreaInsets()
    const windowWidth = Dimensions.get('window').width

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedRoom, setSelectedRoom] = useState(null)
    const navigation = useNavigation() // Initialize navigation

    const [shuffledRooms, setShuffledRooms] = useState([])

    const username = useProfileStore((state) => state.displayName)
    const userId = useAuthStore((state) => state.userId)

    const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)
    const resetPlayer = useMusicStore((state) => state.resetPlayer)
    const changeIsPlaying = useMusicStore((state) => state.changeIsPlaying)
    const soundObject = useMusicStore((state) => state.soundObject)
    const changeSoundObject = useMusicStore((state) => state.changeSoundObject)
    const changeRole = useQueueStore((state) => state.changeRole)

    useEffect(() => {
        console.log('Fetching rooms...')
        changeCurrentPage('RadioRoom')
        room_getAllRooms()
            .then((roomData) => {
                if (!roomData) {
                    return
                }
                let roomsArray = []
                for (const [key, value] of Object.entries(roomData)) {
                    roomsArray.push({ ...value, id: key })
                }
                // need to do this due to database structure having the id as key because flatlist.
                // Shuffle rooms only when the component mounts or when rooms are fetched
                if (shuffledRooms.length === 0) {
                    // console.log(roomsArray)
                    setShuffledRooms(shuffleArray(roomsArray))
                }
            })
            .catch((error) => {
                console.error('Error fetching rooms:', error)
            })
    }, [])

    const handleRoomSelect = (roomId) => {
        setSelectedRoom(roomId)
    }
    const handleButtonClick = () => {
        // Navigate to "CreateRoom" screen when the button is clicked
        navigation.navigate('CreateRoom')
    }
    const goToChatroom = (roomId) => {
        changeIsPlaying(false)
        resetPlayer()
        navigation.navigate('Chatroom', {
            roomID: roomId,
        })
    }
    function shuffleArray(array) {
        let shuffledArray = [...array]
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
        }
        return shuffledArray
    }

    const handleJoinRoom = async (room) => {
        if (soundObject) {
            await soundObject.pauseAsync()
            await soundObject.unloadAsync()
            resetPlayer()
        }
        console.log({ roomID: room.id, userID: userId, username: username })
        room_addUser({ roomID: room.id, userID: userId, username: username })
        changeRole('listener')
        goToChatroom(room.id)
    }

    const roomItems = shuffledRooms.map((room) => {
        let owner = 'Loading...'
        if (!room.users) {
            room_removeRoom({ roomID: room.id })
            return
        }
        for (const value of Object.values(room.users)) {
            if (value.owner === true) {
                owner = value.username
            }
        }
        return (
            <View
                key={room.id}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        handleRoomSelect(room.id)
                    }}
                    style={{
                        padding: 20,
                        paddingLeft: selectedRoom === room.id ? 20 : 0,
                        marginTop: selectedRoom === room.id ? 20 : 0,
                        borderRadius: 10,
                        flexDirection: 'column',
                        alignItems: 'center',
                        // backgroundColor: 'red',
                        backgroundColor: selectedRoom === room.id ? COLORS.darkblue : COLORS.dark,
                        height: selectedRoom === room.id ? 190 : 100,
                        width: '100%',
                    }}
                >
                    <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                        <Image
                            source={{ uri: room.image_url }} // Use the image URL from Firebase
                            style={{
                                width: selectedRoom === room.id ? 100 : 80,
                                height: selectedRoom === room.id ? 100 : 80,
                                marginRight: 15,
                                borderRadius: 10,
                            }}
                        />
                        {/* Room Title, Created by, Description */}
                        <View
                            style={{
                                marginRight: 15,
                                justifyContent: 'center',
                                maxWidth: '80%',
                            }}
                        >
                            <BoldText
                                style={{
                                    color: COLORS.light,
                                    fontSize: 16,
                                }}
                            >
                                {room.room_name}
                            </BoldText>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode='tail'
                                style={{
                                    color: COLORS.grey,
                                    fontSize: 12,
                                }}
                            >
                                CREATED BY {owner}
                            </Text>
                            {selectedRoom === room.id ? (
                                <Text
                                    numberOfLines={2}
                                    ellipsizeMode='tail'
                                    style={{
                                        color: COLORS.light,
                                        fontSize: SIZES.small,
                                    }}
                                >
                                    {room.room_description}
                                </Text>
                            ) : null}
                            <Text style={{ color: COLORS.yellow }}>
                                {Object.keys(room.users).length} LISTENING
                            </Text>
                        </View>
                    </View>

                    {/* JOIN BUTTON */}
                    {selectedRoom === room.id ? (
                        <TouchableOpacity
                            style={{
                                backgroundColor: COLORS.primary,
                                borderRadius: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '50%',
                                height: 34,
                            }}
                            onPress={async () => {
                                await handleJoinRoom(room)
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: 'black',
                                    fontWeight: 'bold',
                                }}
                            >
                                Join Room
                            </Text>
                        </TouchableOpacity>
                    ) : null}
                </TouchableOpacity>
            </View>
        )
    })

    return (
        <View
            style={{
                flex: 1,
                paddingTop: insets.top,
                backgroundColor: COLORS.dark,
                width: windowWidth,
            }}
        >
            <ScrollView
                style={{
                    padding: 20,
                    paddingTop: 0,
                    flex: 1,
                    backgroundColor: COLORS.dark,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <BoldText
                        style={{
                            color: COLORS.light,
                            fontSize: 25,
                            marginTop: 20,
                        }}
                    >
                        RadioRooms
                    </BoldText>
                    {/* CREATE ROOM BUTTON */}
                    <TouchableOpacity
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 45,
                            width: 60,
                            borderRadius: 30,
                            marginTop: 7,
                        }}
                        onPress={handleButtonClick}
                    >
                        <Text
                            style={{
                                fontSize: 40,
                                color: '#41BBC4',
                            }}
                        >
                            +
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* SEARCH BAR */}
                <View
                    style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        backgroundColor: '#333',
                        borderRadius: 10,
                        alignItems: 'center',
                        paddingHorizontal: 10,
                    }}
                >
                    <Ionicons name={'ios-search'} size={25} color={COLORS.grey} />
                    <TextInput
                        autoFocus={false}
                        style={{
                            color: COLORS.light,
                            width: 250,
                            fontSize: SIZES.medium,
                            padding: 10,
                        }}
                        placeholder='Search by room code'
                        placeholderTextColor={COLORS.grey}
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                </View>

                <BoldText
                    style={{
                        fontSize: SIZES.large,
                        color: COLORS.light,
                        marginTop: 20,
                    }}
                >
                    Recommended for you
                </BoldText>

                {roomItems}
            </ScrollView>
        </View>
    )
}
export default RadioRooms
