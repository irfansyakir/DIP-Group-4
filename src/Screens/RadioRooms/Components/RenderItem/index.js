import {useRoomListener} from "../../../../Utilities/Firebase/useFirebaseListener";
import {useEffect, useState} from "react";
import {room_addUser} from "../../../../Utilities/Firebase/room_functions";
import {useMusicStore} from "../../../../Store/useMusicStore";
import { useNavigation } from "@react-navigation/native";
import {userQueue_getRoomQueue} from "../../../../Utilities/Firebase/user_queue_functions";
import {useQueueStore} from "../../../../Store/useQueueStore";

const {View, TouchableOpacity, Image, Text} = require("react-native");
const {COLORS, SIZES} = require("../../../../Constants");
const {BoldText} = require("../../../../Commons/UI/styledText");
const React = require("react");
export function FlatlistRenderItem ({item, selectedRoom, handleRoomSelect, storeUserID, storeDisplayName, setJoinedRooms, joinedRooms, setToggleFlatlistReRender}) {
  const [roomListener] = useRoomListener(item.id)
  const [transformedRoomListener, setTransformedRoomListener] = useState()
  const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)
  const navigation = useNavigation(); // Initialize navigation\


  useEffect(() => {
    if(!roomListener) return
    setTransformedRoomListener({...roomListener, id: selectedRoom, title: roomListener.room_name})
    // setTransformedRoomListener(roomListener)
  }, [roomListener]);

  const swapToRoomQueue = async (roomId) => {
    const roomQueue =  await userQueue_getRoomQueue({ roomID: roomId })
    changeQueue(roomQueue)
  }

  const updateUsers = () => {

  }

  const changeQueue = useQueueStore((state) => state.changeQueue)
  const goToChatroom = async ({roomID, userID, username}) => {
    await swapToRoomQueue(roomID)
    await room_addUser({roomID: roomID, userID: userID, username: username})
    navigation.navigate('Chatroom', {
      roomID: roomID,
    })
    changeCurrentPage('Chatroom')

    // console.log("Clicked!")
  }

  let owner = 'Loading...';
  let image = require('../../../../../assets/themes/goodvibes.jpg')

  // add here for more themes
  switch (roomListener?.themeImageUrl){
    case 'clouds':
      image = require('../../../../../assets/themes/clouds.png')
      break;
    case 'palmtrees':
      image = require('../../../../../assets/themes/palmtrees.png')
      break;
    case 'raindrops':
      image = require('../../../../../assets/themes/raindrops.png')
      break;
  }

  if(roomListener){
    for (const [key, value] of Object.entries(roomListener.users)) {
      if(value.owner === true){
        owner = value.username
      }
    }
  }

  return(
    (roomListener &&

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
              {roomListener.room_name}
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
                {roomListener.room_description}
              </Text> : null
            }
            <Text style={{color: COLORS.yellow}}>
              {Object.keys(roomListener.users).length} LISTENING
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
            goToChatroom({roomID: selectedRoom, userID: storeUserID, username: storeDisplayName})
            // console.log(item)
            // console.log(transformedRoomListener)
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
    </View>)
  )
};