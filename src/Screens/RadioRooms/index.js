import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from '../../Store/useAuthStore'
import { useQueueStore } from '../../Store/useQueueStore'
import { userQueue_updateQueue } from '../../Utilities/Firebase/user_queue_functions'
import { room_getAllRooms } from "../../Utilities/Firebase/room_functions";
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BoldText } from "../../Commons/UI/styledText";
import { COLORS, SIZES } from "../../Constants";
import Ionicons from '@expo/vector-icons/Ionicons'
import { useMusicStore } from '../../Store/useMusicStore'
import { userQueue_getRoomQueue } from '../../Utilities/Firebase/user_queue_functions'

export const RadioRooms = (currentPage) => {
  const insets = useSafeAreaInsets()
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const navigation = useNavigation(); // Initialize navigation\

  const changeQueue = useQueueStore((state) => state.changeQueue)
  const [shuffledRooms, setShuffledRooms] = useState([]);

  const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)

  useEffect(() => {
    console.log("Fetching rooms...");
    room_getAllRooms()
      .then((roomData) => {
        // console.log("Rooms fetched:", roomData);

        // Convert the object to an array

        let roomsArray = []
        for (const [key, value] of Object.entries(roomData)) {
          roomsArray.push({...value, id: key})
        }
        //need to do this due to database structure having the id as key because flatlist. This caused me 2 hours of pain
        // Shuffle rooms only when the component mounts or when rooms are fetched
        if (shuffledRooms.length === 0) {
          // console.log(roomsArray)
          setShuffledRooms(shuffleArray(roomsArray));
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
  const goToChatroom = (roomId) => {
    navigation.navigate('Chatroom', {
      roomID: roomId,
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

  const renderItem = ({ item }, obj) => (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
    }}>
      <TouchableOpacity
        onPress={() => handleRoomSelect(item.id)}
        style={{
          padding: 20,
          paddingLeft: selectedRoom === item.id ? 20 : 0,
          marginTop: selectedRoom === item.id ? 20 : 0,
          borderRadius: 10,
          flexDirection: "column",
          alignItems: "center",
          // backgroundColor: 'red',
          backgroundColor: selectedRoom === item.id ? COLORS.darkblue : COLORS.dark,
          height: selectedRoom === item.id ? 190 : 100,
          }}
      >
      <View style={{flexDirection:'row', marginBottom:15,}}>
      <Image
          source={{ uri: item.image_url }} // Use the image URL from Firebase
          style={{
            width: selectedRoom === item.id ? 100 : 80,
            height: selectedRoom === item.id ? 100 : 80,
            marginRight: 15,
            borderRadius: 10,}}
        />
        {/* Room Title, Created by, Description */}
        <View style={{marginRight:15, justifyContent:'center', maxWidth:'80%'}}>
        <BoldText style={{
          color: COLORS.light,
          fontSize: 16, }}>
          {item.room_name}
        </BoldText>
        <Text numberOfLines={1}
          ellipsizeMode='tail'
          style={{
            color: COLORS.grey,
            fontSize: 12,}}>
          CREATED BY ddkfmadkfmakf{item.created_by}
        </Text>
        {selectedRoom === item.id ?<Text numberOfLines={2}
        ellipsizeMode='tail'
        style={{
          color: COLORS.light,
          fontSize: SIZES.small
        }}>room description here blbeabadajsndkasndskl</Text>:null}
        <Text style={{color: COLORS.yellow}}>
          100 LISTENING
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
          width: '50%',
          height: 34,
        }} onPress={() => {
          goToChatroom(item.id)
          swapToRoomQueue(item.id)
          }}>
          <Text style={{
            fontSize: 14,
            color: "black",
            fontWeight: "bold",
          }} >Join Room</Text>
        </TouchableOpacity>: null}

      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{flex:1, paddingTop: insets.top, backgroundColor: COLORS.dark}}>
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
      <View style={{
          marginTop: 10,
          flexDirection: 'row',
          backgroundColor: '#333',
          borderRadius: 10,
          alignItems: 'center',
          paddingHorizontal: 10,}}>
          <Ionicons name={'ios-search'} size={25} color={COLORS.grey} />
          <TextInput
            autoFocus={false}
            style={{
              color: COLORS.light,
              width: 250,
              fontSize: SIZES.medium,
              padding: 10,}}
            placeholder='Search by room code'
            placeholderTextColor={COLORS.grey}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>

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
    </View>
  );
};
export default RadioRooms;