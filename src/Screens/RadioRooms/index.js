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
import { useProfileStore } from '../../Store/useProfileStore'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { FlatlistRenderItem } from './Components/RenderItem'
import { useMusicStore } from '../../Store/useMusicStore'

export const RadioRooms = (currentPage) => {
    const insets = useSafeAreaInsets()
    const windowWidth = Dimensions.get('window').width

    const [roomCodeQuery, setRoomCodeQuery] = useState('')
    const [selectedRoom, setSelectedRoom] = useState(null)
    const navigation = useNavigation() // Initialize navigation\

    const [shuffledRooms, setShuffledRooms] = useState([])
    const userID = useAuthStore((state) => state.userId)
    const username = useProfileStore((state) => state.displayName)

    const [joinedRooms, setJoinedRooms] = useState([])
    const [publicRooms, setPublicRooms] = useState([])
    const [privateRooms, setPrivateRooms] = useState([])

    const storeDisplayName = useProfileStore((state) => state.displayName)
    const storeUserID = useAuthStore((state) => state.userId)

    const [toggleFlatlistReRender, setToggleFlatlistReRender] = useState(false)

    const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)
    const resetPlayer = useMusicStore((state) => state.resetPlayer)
    const changeIsPlaying = useMusicStore((state) => state.changeIsPlaying)
    const soundObject = useMusicStore((state) => state.soundObject)
    const changeSoundObject = useMusicStore((state) => state.changeSoundObject)
    const changeRole = useQueueStore((state) => state.changeRole)

    useEffect(() => {
        //Flatlist wont update no matter what. Improv using focus blur to update every time.
        const fetchFunction = () => {
            console.log('Fetching rooms...')
            room_getAllRooms()
                .then((roomData) => {
                    if (!roomData) {
                        return
                    }
                    // console.log("Rooms fetched:", roomData);

                    // Convert the object to an array
                    let roomsArray = []
                    for (const [key, value] of Object.entries(roomData)) {
                        roomsArray.push({ ...value, id: key })
                    }
                    let tempPublicRooms = []
                    let urRooms = []
                    let tempPrivateRooms = []
                    //roomID is in roomValues
                    for (const [_, roomValues] of Object.entries(roomsArray)) {
                        let hasJoinedThisRoom = false
                        // console.log(roomValues)
                        if (!roomValues.users) {
                            console.log('no user rooms', roomValues)
                            continue
                        }
                        for (const [userID, userDetails] of Object.entries(roomValues.users)) {
                            if (userID === storeUserID) {
                                urRooms.push({ ...roomValues, title: roomValues.room_name })
                                hasJoinedThisRoom = true
                                break
                            }
                        }
                        if (!hasJoinedThisRoom) {
                            if (roomValues.isPublic) {
                                tempPublicRooms.push({ ...roomValues, title: roomValues.room_name })
                            } else {
                                tempPrivateRooms.push({
                                    ...roomValues,
                                    title: roomValues.room_name,
                                })
                            }
                        }
                    }
                    setJoinedRooms(urRooms)
                    setPublicRooms(tempPublicRooms)
                    setPrivateRooms(tempPrivateRooms)
                    //need to do this due to database structure having the id as key because flatlist.
                    // Shuffle rooms only when the component mounts or when rooms are fetched
                    if (shuffledRooms.length === 0) {
                        setShuffledRooms(shuffleArray(tempPublicRooms))
                    }
                })
                .catch((error) => {
                    console.error('Error fetching rooms:', error)
                })
        }

        const unsubscribe1 = navigation.addListener('focus', () => {
            fetchFunction()
        })
        const unsubscribe2 = navigation.addListener('blur', () => {
            fetchFunction()
        })
        return () => {
            unsubscribe1()
            unsubscribe2()
        }
    }, [])

    useEffect(() => {
        changeCurrentPage('RadioRoom')
    }, [])

    // useEffect(() => {
    //   console.log("Fetching rooms...");
    //   room_getAllRooms()
    //     .then((roomData) => {
    //       if(!roomData){
    //         return
    //       }
    //       // console.log("Rooms fetched:", roomData);
    //
    //       // Convert the object to an array
    //       let roomsArray = []
    //       for (const [key, value] of Object.entries(roomData)) {
    //         roomsArray.push({...value, id: key})
    //       }
    //       let tempPublicRooms = []
    //       let urRooms = []
    //       let tempPrivateRooms = []
    //       //roomID is in roomValues
    //       for (const [_, roomValues] of Object.entries(roomsArray)) {
    //         let hasJoinedThisRoom = false
    //         // console.log(roomValues)
    //         for (const [userID, userDetails] of Object.entries(roomValues.users)){
    //           if (userID === storeUserID){
    //             urRooms.push({...roomValues, title: roomValues.room_name})
    //             hasJoinedThisRoom = true
    //             break
    //           }
    //         }
    //         if(!hasJoinedThisRoom){
    //           if (roomValues.isPublic){
    //             tempPublicRooms.push({...roomValues, title: roomValues.room_name})
    //           } else {
    //             tempPrivateRooms.push({...roomValues, title: roomValues.room_name})
    //           }
    //         }
    //       }
    //       setJoinedRooms(urRooms)
    //       setPublicRooms(tempPublicRooms)
    //       setPrivateRooms(tempPrivateRooms)
    //       //need to do this due to database structure having the id as key because flatlist.
    //       // Shuffle rooms only when the component mounts or when rooms are fetched
    //       if (shuffledRooms.length === 0) {
    //         setShuffledRooms(shuffleArray(tempPublicRooms));
    //       }
    //
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching rooms:", error);
    //     });
    // }, []);

    const handleRoomSelect = (roomId) => {
        setSelectedRoom(roomId)
    }
    const handleButtonClick = () => {
        // Navigate to "CreateRoom" screen when the button is clicked
        navigation.navigate('CreateRoom')
    }

    function shuffleArray(array) {
        let shuffledArray = [...array]
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
        }
        return shuffledArray
    }

    const handleJoinRoom = async ({ roomID, userID, username }) => {
        if (soundObject) {
            try {
                await soundObject.pauseAsync()
                await soundObject.unloadAsync()
                changeSoundObject(null)
            } catch (err) {
                console.error(err)
            }
        }
        await room_addUser({ roomID: roomID, userID: userID, username: username })
        changeCurrentPage('Chatroom')
        changeIsPlaying(false)
        changeRole('listener')
        navigation.navigate('Chatroom', {
            roomID: roomID,
        })
    }

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
                style={{ padding: 20, paddingTop: 0, flex: 1, backgroundColor: COLORS.dark }}
            >
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <BoldText style={{ color: COLORS.light, fontSize: 25, marginTop: 20 }}>
                        JamRooms
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

                <AutocompleteDropdown
                    clearOnFocus={false}
                    closeOnBlur={true}
                    closeOnSubmit={false}
                    onSubmit={() => {
                        let privateFound = privateRooms.find(
                            (element) => element.id === roomCodeQuery
                        )
                        if (privateFound) {
                            handleJoinRoom({
                                roomID: privateFound.id,
                                userID: storeUserID,
                                username: storeDisplayName,
                            })
                        } else {
                            let theRestOfTheRoomsFound = publicRooms
                                .concat(joinedRooms)
                                .find((element) => element.id === roomCodeQuery)
                            if (theRestOfTheRoomsFound) {
                                handleJoinRoom({
                                    roomID: theRestOfTheRoomsFound.id,
                                    userID: storeUserID,
                                    username: storeDisplayName,
                                })
                            }
                        }
                    }}
                    onChangeText={(text) => {
                        setRoomCodeQuery(text)
                    }}
                    matchFrom={'any'}
                    initialValue={''}
                    // suggestionsListMaxHeight={}
                    // initialValue={{ id: '2' }} // or just '2'
                    dataSet={joinedRooms.concat(publicRooms)}
                    onSelectItem={(item) => {
                        if (item) {
                            handleJoinRoom({
                                roomID: item.id,
                                userID: storeUserID,
                                username: storeDisplayName,
                            })
                        }
                    }}
                    inputContainerStyle={{
                        marginTop: 10,
                        flexDirection: 'row',
                        backgroundColor: '#333',
                        borderRadius: 10,
                        alignItems: 'center',
                        paddingHorizontal: 10,
                    }}
                    textInputProps={{
                        autoFocus: false,
                        style: {
                            color: COLORS.light,
                            width: 250,
                            fontSize: SIZES.medium,
                            padding: 10,
                        },
                        placeholder: 'Search by room code or name',
                        placeholderTextColor: COLORS.grey,
                    }}
                    suggestionsListContainerStyle={{
                        // color: COLORS.darkblue,
                        backgroundColor: '#333',
                    }}
                    suggestionsListTextStyle={{
                        color: COLORS.light,
                        width: 250,
                        fontSize: SIZES.medium,
                        padding: 10,
                    }}
                />

                <BoldText
                    style={{
                        fontSize: SIZES.large,
                        color: COLORS.primary,
                        marginTop: 20,
                    }}
                >
                    Your Rooms
                </BoldText>
                <FlatList
                    data={joinedRooms}
                    extraData={toggleFlatlistReRender}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <FlatlistRenderItem
                            item={item}
                            selectedRoom={selectedRoom}
                            handleRoomSelect={handleRoomSelect}
                            storeDisplayName={storeDisplayName}
                            storeUserID={storeUserID}
                            setJoinedRooms={setJoinedRooms}
                            joinedRooms={joinedRooms}
                            setToggleFlatlistReRender={setToggleFlatlistReRender}
                        />
                    )}
                />

                <BoldText
                    style={{
                        fontSize: SIZES.large,
                        color: COLORS.light,
                        marginTop: 20,
                    }}
                >
                    Recommended for you
                </BoldText>

                <FlatList
                    // data={shuffledRooms.slice(0, 5)} // Display a random selection of 5 rooms
                    data={shuffledRooms} //for now display all rooms cuz easier debugging
                    extraData={toggleFlatlistReRender}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <FlatlistRenderItem
                            item={item}
                            selectedRoom={selectedRoom}
                            handleRoomSelect={handleRoomSelect}
                            storeDisplayName={storeDisplayName}
                            storeUserID={storeUserID}
                            setJoinedRooms={setJoinedRooms}
                            joinedRooms={joinedRooms}
                            setToggleFlatlistReRender={setToggleFlatlistReRender}
                        />
                    )}
                    style={{ marginBottom: 150 }}
                />
            </ScrollView>
            {/*<ScrollView style={{ padding: 20, paddingTop:0, flex: 1, backgroundColor: COLORS.dark,}}>*/}

            {/*</ScrollView>*/}
        </View>
    )
}
export default RadioRooms
