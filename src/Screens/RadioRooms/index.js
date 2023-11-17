import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView, Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from '../../Store/useAuthStore'
import { useQueueStore } from '../../Store/useQueueStore'
import { userQueue_updateQueue } from '../../Utilities/Firebase/user_queue_functions'
import {room_addUser, room_getAllRooms} from "../../Utilities/Firebase/room_functions";
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BoldText } from "../../Commons/UI/styledText";
import { COLORS, SIZES } from "../../Constants";
import Ionicons from '@expo/vector-icons/Ionicons'
import { useMusicStore } from '../../Store/useMusicStore'
import { useProfileStore } from "../../Store/useProfileStore";
import { userQueue_getRoomQueue } from '../../Utilities/Firebase/user_queue_functions'
import {AutocompleteDropdown} from "react-native-autocomplete-dropdown";

export const RadioRooms = (currentPage) => {
  const insets = useSafeAreaInsets()
  const windowWidth = Dimensions.get('window').width;

  const [roomCodeQuery, setRoomCodeQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const navigation = useNavigation(); // Initialize navigation\

  const changeQueue = useQueueStore((state) => state.changeQueue)
  const [shuffledRooms, setShuffledRooms] = useState([]);

  const [joinedPrivateRooms, setJoinedPrivateRooms] = useState([]);
  const [publicRooms, setPublicRooms] = useState([])
  const [privateRooms, setPrivateRooms] = useState([])

  const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)
  const storeDisplayName = useProfileStore((state) => state.displayName)
  const storeUserID = useAuthStore((state) => state.userId)

  useEffect(() => {
    console.log("Fetching rooms...");
    room_getAllRooms()
      .then((roomData) => {
        if(!roomData){
          return
        }
        // console.log("Rooms fetched:", roomData);

        // Convert the object to an array
        let roomsArray = []
        for (const [key, value] of Object.entries(roomData)) {
          roomsArray.push({...value, id: key})
        }
        let tempPublicRooms = []
        let urRooms = []
        let tempPrivateRooms = []
        //roomID is in roomValues
        for (const [_, roomValues] of Object.entries(roomsArray)) {
          let hasJoinedThisRoom = false
          // console.log(roomValues)
          for (const [userID, userDetails] of Object.entries(roomValues.users)){
            if (userID === storeUserID){
              urRooms.push({...roomValues, title: roomValues.room_name})
              hasJoinedThisRoom = true
              break
            }
          }
          if(!hasJoinedThisRoom){
            if (roomValues.isPublic){
              tempPublicRooms.push({...roomValues, title: roomValues.room_name})
            } else {
              tempPrivateRooms.push({...roomValues, title: roomValues.room_name})
            }
          }
        }
        setJoinedPrivateRooms(urRooms)
        setPublicRooms(tempPublicRooms)
        setPrivateRooms(tempPrivateRooms)
        //need to do this due to database structure having the id as key because flatlist.
        // Shuffle rooms only when the component mounts or when rooms are fetched
        if (shuffledRooms.length === 0) {
          setShuffledRooms(shuffleArray(tempPublicRooms));
        }
        
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
  }, []);

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
  };
  const handleButtonClick = () => {
    // Navigate to "CreateRoom" screen when the button is clicked
    navigation.navigate("CreateRoom");
  };
  const goToChatroom = async ({roomID, userID, username}) => {
    await swapToRoomQueue(roomID)
    await room_addUser({roomID: roomID, userID: userID, username: username})
    navigation.navigate('Chatroom', {
      roomID: roomID,
    })
    changeCurrentPage('Chatroom')

    // console.log("Clicked!")
  }
  function shuffleArray(array) {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  const swapToRoomQueue = async (roomId) => {
    const roomQueue =  await userQueue_getRoomQueue({ roomID: roomId })
    changeQueue(roomQueue)
  }

  const userAlreadyInRoom = (userID, roomID) => {

  }

  const renderItem = ({ item }) => {
    let owner = 'Loading...';
    let image = require('../../../assets/themes/goodvibes.jpg') 
    
    // add here for more themes
    switch (item.themeImageUrl){
      case 'clouds':
        image = require('../../../assets/themes/clouds.png')
        break;
      case 'palmtrees':
        image = require('../../../assets/themes/palmtrees.png')
        break;
      case 'raindrops':
        image = require('../../../assets/themes/raindrops.png')
        break;
    }
    
    for (const [key, value] of Object.entries(item.users)) {
      if(value.owner === true){
        owner = value.username
      }
    }
    
    return(
      <View style={{
        flexDirection: "row",
        alignItems: "center",
      }}>
        <TouchableOpacity
          onPress={() => {
            // console.log(item)
            handleRoomSelect(item.id)
          }}
          style={{
            padding: 20,
            paddingLeft: selectedRoom === item.id ? 20 : 0,
            marginTop: selectedRoom === item.id ? 20 : 0,
            borderRadius: 10,
            flexDirection: "column",
            backgroundColor: selectedRoom === item.id ? COLORS.darkblue : COLORS.dark,
            height: selectedRoom === item.id ? 190 : 100,
            width: '100%'
          }}
        >
          <View style={{flexDirection: 'row', marginBottom: 15,}}>
            <Image
              // source={{uri: item.image_url}} // Use the image URL from Firebase
              
              source={image}
              style={{
                width: selectedRoom === item.id ? 100 : 80,
                height: selectedRoom === item.id ? 100 : 80,
                marginRight: 15,
                borderRadius: 10,
              }}
            />
            {/* Room Title, Created by, Description */}
            <View style={{marginRight: 15, justifyContent: 'center', flex:1}}>
              <BoldText style={{
                color: COLORS.light,
                fontSize: 16,
              }} numberOfLines={1}
              ellipsizeMode='tail' >
                {item.room_name}
              </BoldText>
              <Text numberOfLines={1}
                    ellipsizeMode='tail'
                    style={{
                      color: COLORS.grey,
                      fontSize: 12,
                    }}>
                CREATED BY {owner}
              </Text>
              {selectedRoom === item.id ?
                <Text
                  numberOfLines={2}
                  ellipsizeMode='tail'
                  style={{
                    color: COLORS.light,
                    fontSize: SIZES.small
                  }}>
                  {item.room_description}
                </Text> : null
              }
              <Text style={{color: COLORS.yellow}}>
                {Object.keys(item.users).length} LISTENING
              </Text>
            </View>
          </View>

          {/* JOIN BUTTON */}
          {selectedRoom === item.id ?
            <TouchableOpacity style={{
              backgroundColor: COLORS.primary,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: 'center',
              width: '50%',
              height: 34,
            }} onPress={() => {
              goToChatroom({roomID: item.id, userID: storeUserID, username: storeDisplayName})
              // console.log(item)
              // if(userAlreadyInRoom){
              //   room_addUser({roomID: item.id, userID: storeUserID, username: storeDisplayName}).then()
              // }
            }}>
              <Text style={{
                fontSize: 14,
                color: "black",
                fontWeight: "bold",
              }}>Join Room</Text>
            </TouchableOpacity> : null}

        </TouchableOpacity>
      </View>
    )
  };

  return (
    <View style={{flex:1, paddingTop: insets.top, backgroundColor: COLORS.dark, width: windowWidth}}>
      <ScrollView style={{ padding: 20, paddingTop:0, flex: 1, backgroundColor: COLORS.dark,}}>
        <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <BoldText style={{ color: COLORS.light, fontSize: 25, marginTop: 20}}>
            RadioRooms
          </BoldText>
          {/* CREATE ROOM BUTTON */}
          <TouchableOpacity style={{
            justifyContent: "center",
            alignItems: "center",
            height: 45,
            width: 60,
            borderRadius: 30,
            marginTop: 7,
          }} onPress={handleButtonClick}>
            <Text style={{
              fontSize: 40,
              color: "#41BBC4",}}>+</Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}

        <AutocompleteDropdown
          clearOnFocus={false}
          closeOnBlur={true}
          closeOnSubmit={false}
          onSubmit={() => {
            let privateFound = privateRooms.find(element => element.id === roomCodeQuery)
            if(privateFound) {
              goToChatroom({roomID: privateFound.id, userID: storeUserID, username: storeDisplayName})
            } else {
              let theRestOfTheRoomsFound = publicRooms.concat(joinedPrivateRooms).find(element => element.id === roomCodeQuery)
              if(theRestOfTheRoomsFound) {
                goToChatroom({roomID: theRestOfTheRoomsFound.id, userID: storeUserID, username: storeDisplayName})
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
          dataSet={joinedPrivateRooms.concat(publicRooms)}
          onSelectItem={(item) => {
            if(item) {
              goToChatroom({roomID: item.id, userID: storeUserID, username: storeDisplayName})
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
            autoFocus:false,
            style:{
              color: COLORS.light,
              width: 250,
              fontSize: SIZES.medium,
              padding: 10
            },
            placeholder:'Search by room code or name',
            placeholderTextColor: COLORS.grey
          }}
          suggestionsListContainerStyle={{
            // color: COLORS.darkblue,
            backgroundColor: '#333',
          }}
          suggestionsListTextStyle={{
            color: COLORS.light,
            width: 250,
            fontSize: SIZES.medium,
            padding: 10
          }}



          // renderItem={(item, searchText) => {
          //   return(
          //     <Text>Test</Text>
          //   )
          // }}
        />

        <BoldText style={{
          fontSize: SIZES.large,
          color: COLORS.primary,
          marginTop: 20,
        }}>Your Rooms</BoldText>
        <FlatList
          data={joinedPrivateRooms}
          keyExtractor={(item)=>item.id}
          renderItem={renderItem}
        />

        <BoldText style={{
          fontSize: SIZES.large,
          color: COLORS.light,
          marginTop: 20,
        }}>Recommended for you</BoldText>

        <FlatList
          // data={shuffledRooms.slice(0, 5)} // Display a random selection of 5 rooms
          data={shuffledRooms} //for now display all rooms cuz easier debugging
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={{marginBottom:150}}
        />
      </ScrollView>
    {/*<ScrollView style={{ padding: 20, paddingTop:0, flex: 1, backgroundColor: COLORS.dark,}}>*/}

    {/*</ScrollView>*/}
    </View>
  );
};
export default RadioRooms;