import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { BackgroundImage } from '@rneui/base';
import * as Clipboard from 'expo-clipboard';

import chatroomBackground from '../../../../../assets/RadioRoomBackground.jpg'

import {useAuthStore} from '../../../../Store/useAuthStore'
import MessageBubble from './Components/MessageBubble';
import {GetCurrentUserProfile, GetTrack} from '../../../../Utilities/SpotifyApi/Utils'
import {message_getMessage, message_setMessage} from '../../../../Utilities/Firebase/messages_functions'
import {
  useIsCurrentTrackPlayingListener,
  useMessageListener,
  useRoomTrackIDListener, useTimeOfLastPlayedListener
} from '../../../../Utilities/Firebase/useFirebaseListener';
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {room_getRoom, room_updateRoom} from '../../../../Utilities/Firebase/room_functions';
import {BoldText, MediumText} from "../../../../Commons/UI/styledText";
import {useMusicStore} from "../../../../Store/useMusicStore";

import { useQueueStore } from '../../../../Store/useQueueStore'
import { userQueue_getQueue } from '../../../../Utilities/Firebase/user_queue_functions'

import { COLORS, SIZES } from '../../../../Constants';
import {useFocusEffect} from "@react-navigation/native";
import {current_track_updateCurrentTrack} from "../../../../Utilities/Firebase/current_track_functions";
import {useProfileStore} from "../../../../Store/useProfileStore";
export const Chatroom = ({route, navigation}) => {
  const { roomID } = route.params;
  const accessToken = useAuthStore((state) => state.accessToken)

  // -------------------------------------------------------------------------------------------------Chat Initializations

  const inset = useSafeAreaInsets();
  const [message, setMessage] = useState(''); // State to store the message text
  const [chatMessages, setChatMessages] = useState([]); // State to store chat messages
  const [roomName, setRoomName] = useState('Loading...');
  const [roomImage, setImage] = useState('');

  const [numOfListeners, setNumOfListeners] = useState(0)

  const scrollViewRef = useRef(); // Create a ref for the ScrollView

  const [chatRefresh] = useMessageListener(roomID);

  const displayName = useProfileStore((state) => state.displayName)
  const [username, setUsername] = useState(displayName);

  // -------------------------------------------------------------------------------------------------Song Player Initializations

  //TODO: Resolve conflict between radioroom queue & user queue so that when radioroom song done playing can go to next radioroom song from any page

  const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)
  const currentPage = useMusicStore((state) => state.currentPage)
  const isPlaying = useMusicStore((state) => state.isPlaying)
  const changeIsPlaying = useMusicStore((state) => state.changeIsPlaying)

  const isDJ = useMusicStore((state) => state.radioRoom_isDJ)
  const changeIsDJ = useMusicStore((state) => state.changeRadioRoom_isDJ)
  const isBroadcasting = useMusicStore(state => state.radioRoom_isBroadcasting)
  const changeIsBroadcasting = useMusicStore(state => state.changeRadioRoom_isBroadcasting)
  const songId = useMusicStore((state) => state.songInfo.songId)

  const position = useMusicStore((state) => state.position)

  const [roomUserIDList, setRoomUserIDList] = useState([])
  const [roomDJIDList, setRoomDJIDList] = useState([])

  const [roomIsUserListening, setRoomIsUserListening] = useState(false)

  const [roomIsCurrentTrackPlaying] = useIsCurrentTrackPlayingListener(roomID)
  const [roomTimeOfLastPlayed] = useTimeOfLastPlayedListener(roomID)
  const [roomCurrentTrackID] = useRoomTrackIDListener(roomID)

  // ------------------------------------------------------------------------------------------------- Room Queue Initializations

  const storeQueue = useQueueStore((state) => state.queue)
  const changeQueue = useQueueStore((state) => state.changeQueue)
  const userId = useAuthStore((state) => state.userId)

  const swapToQueue = async () => {
    const personalQueue =  await userQueue_getQueue({ userID: userId,})
    changeQueue(personalQueue)
  }
  
  // -------------------------------------------------------------------------------------------------Room Functions


  //TODO: Make sure that at least 1 user exist in roomDetails, otherwise got error "Possible unhandled promise rejection, cannot convert undefined value to object"
  const getRoomDetails = async () => {
    const roomDetails = await room_getRoom({roomID: roomID});
    // console.log('Room Name: '+ roomDetails["room_name"]);
    setRoomName(roomDetails["room_name"]);
    setImage(roomDetails["image_url"]);
    // setRoomUserIDList(...roomUserIDList, Object.keys(roomDetails.users))
    if(roomDetails['dj'].includes(userId)){
      changeIsDJ(true)
    } else{
      changeIsDJ(false)
    }
    setNumOfListeners(Object.keys(roomDetails.users).length)
    // console.log(roomUserIDList)
    // setRoomDJIDList(roomDetails["dj"] ? roomDetails["dj"] : [])
    // roomDetails["dj"].includes()
  }

  const getMessages = async () => {
    // fetch messages from firebase
    try {
      const messages = await message_getMessage({roomID:roomID});
      const newMessagesArray = [];
      let id = 0;

      messages.map(obj => obj.toJSON()).forEach(obj => {
        const date = new Date(obj.timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        let right = true;

        // if the message's sender's username is the same as the current user's username,
        // the chat bubble will be on the right side
        if (obj.username !== username) {
          right = false;
        }

        const newMessage = {
          text: obj.message,
          id: id++,
          timestamp: formattedTime,
          right: right,
          username: obj.username,
        }


        newMessagesArray.push(newMessage);
      })

      setChatMessages(newMessagesArray);

    } catch (error) {
      console.error("Error while getting messages:", error);
    }
  }

  const sendMessage = () => {
    if (message.trim() !== '') {

      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;
      const right = true;

      const newMessage = {
        text: message,
        id: chatMessages.length.toString(),
        timestamp: currentTime,
        right: right,
        username: username,
      };

      // Update the chatMessages state with the new message
      setChatMessages([...chatMessages, newMessage]);

      // console.log('sending message: ' + message);
      message_setMessage( {
        roomID: roomID,
        username: username,
        message: message,
        timestamp: now.getTime(),
      });

      // Clear the input field
      setMessage('');

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }
  };



  // -------------------------------------------------------------------------------------------------Use Effects

  // -------------------------------------------------------------------------------------------------Legacy code pre merge w/ xinzhen's dont know if gonna use or not

  //Merging stuff with xinzhens code. Have no idea will this be used or not
  // useFocusEffect(
  //   useCallback(() => {
  //     const subscribe = navigation.addListener('focus', () => {
  //         console.log("UseCallback Run")
  //         changeCurrentPage("Chatroom")
  //     })
  //     const unsubscribe = navigation.addListener('blur', () => {
  //       // const nextNavigationStateToVisit = navigation.getState()['routes'].at(-1)
  //       // if (nextNavigationStateToVisit['name'] === 'Track'){
  //       //   changeCurrentPage("Track")
  //       // } else{
  //       //   changeCurrentPage("Not Track")
  //       // }
  //       // console.log("asdujifhsdiuf")
  //       // changeCurrentPage("Not Track")
  //     })
  //     return () => {unsubscribe()}
  //   }, [navigation])
  // )

  // useEffect(() => {
  //   console.log("useEffect run")
  //   if(isUserListeningToRoom){
  //     changeCurrentPage("Chatroom")
  //   }
  //   else {
  //     changeCurrentPage("Not Track")
  //   }
  // }, [isUserListeningToRoom]);

  // -------------------------------------------------------------------------------------------------Legacy code end


  // call when the screen is first opened
  useEffect( () => {
    // console.log('RoomID: ' + roomID);
    getRoomDetails().then();
    return () => {
      changeCurrentPage("Not Track")
      changeIsBroadcasting(false)
      changeIsPlaying(false)
    }
  }, [])

  // Use useEffect to scroll to the bottom when chatMessages change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);

  useEffect(() => {
    getMessages();
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [username, chatRefresh])

  //Careful with the useEffects below

  useEffect(() => {
    if(isBroadcasting){
      current_track_updateCurrentTrack({roomID: roomID, timeOfLastPlayed: position, trackId: songId}).then()
    }
  }, [position]);
  //separate this just in case of feedback
  useEffect(() => {
    current_track_updateCurrentTrack({roomID: roomID, isCurrentTrackPlaying: isBroadcasting}).then()
  }, [isBroadcasting]);

  useEffect(() => {
    if(roomIsCurrentTrackPlaying){
      changeIsPlaying(true)
    } else {
      changeIsPlaying(false)
      changeIsBroadcasting(false)
    }
  }, [roomIsCurrentTrackPlaying]);


  return (
    <BackgroundImage source={chatroomBackground} blurRadius={5} style={{
    flex:1, padding:10, paddingTop: inset.top,}}>
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex:1,}}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100} // Adjust the offset as needed
      >

      {/* back button */}
      <TouchableOpacity onPress={() => {
        navigation.popToTop()
        changeCurrentPage('Radioroom')
        swapToQueue()
        }} 
        style={{flexDirection: 'row', alignItems:'center',}}>
        <Ionicons name='chevron-back' size={30} color={COLORS.light} />
        <BoldText style= {{color: COLORS.light, fontSize: SIZES.medium}}>Leave Room</BoldText>
      </TouchableOpacity>

      <View style={{flex:1, alignItems:'center',}}>
      {/* room title, view queue button */}
      <View style={{
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        marginVertical: 15,
        width:'95%',}}>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('RoomDetails', {
              // roomName: roomName,
              // roomUserIDList: roomUserIDList,
              // roomDJIDList: roomDJIDList
              roomID: roomID
            });
          }}
        >
          <BoldText style={{fontSize: 25, color: 'white'}}>{roomName}</BoldText>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            paddingVertical:8,
            paddingHorizontal:30,
            borderRadius: 20,
            backgroundColor: COLORS.primary,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {navigation.navigate('RoomQueue', {roomID: roomID})}}
        >
          <BoldText style={{ color: COLORS.darkblue, fontSize: SIZES.medium,}}>View Queue</BoldText>
        </TouchableOpacity>
      </View>

      {/*disabled for now.*/}
      <View style={{ height: 100, width:'100%',
        borderRadius: 10,
        marginBottom: 15, alignItems:'center', justifyContent:'center'}}>
       <Text style={{color:'white'}}>Music Player placeholder</Text>
      </View>

      <ScrollView style={{flex:1, width:'100%',}}>
      {/* Room Code */}
      <View style={{
        height: 70,
        backgroundColor: COLORS.dark, // Change the color as needed
        borderRadius: 10,
        marginBottom: 15,
        padding:15,
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center'}}>

        <TouchableOpacity
          onPress={async () => {
            await Clipboard.setStringAsync(roomID)
          }}
        >
          <View style={{ flexDirection: 'column', }}>
            <Text style={{color: 'white', fontSize: SIZES.small,}}>Room Code</Text>
            <BoldText style={{ fontSize: SIZES.medium,color: COLORS.light,}}>{roomID}</BoldText>
          </View>
        </TouchableOpacity>

        <View style={{flexDirection:'row', alignItems:'center'}}>
        <Text style={{fontSize: SIZES.small, color: COLORS.yellow, marginRight:10}}>{numOfListeners} LISTENING</Text>
        </View>
      </View>

      {/* Chat box */}
      <View style={{
          height: 330,
          backgroundColor: COLORS.darkgrey, // Change the color as needed
          borderRadius: 10,
          padding: 20,
          marginBottom: 15,}}>
      <ScrollView ref={scrollViewRef} keyboardShouldPersistTaps="handled">
        {chatMessages.map((messageItem) => (
          <MessageBubble
            key={messageItem.id}
            text={messageItem.text}
            timestamp={messageItem.timestamp}
            right={messageItem.right}
            username={messageItem.username}
          />
        ))}
      </ScrollView>
      </View>

      {/* Input message box */}
      <View style={{
        flexDirection: 'row',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent:'space-between',
      }}>
        <TextInput
        style={{ width: '85%',
        color: COLORS.light,
        fontSize: SIZES.medium,
        padding: 15,
        backgroundColor: COLORS.darkgrey,
        borderRadius:10,}}
        placeholder="Message..."
        multiline={false} // Set to false for a single-line input
        placeholderTextColor= {COLORS.grey}
        returnKeyType="done"
        onChangeText={(text) => setMessage(text)}
        value={message}
        onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={{
          width:40,
          height:40,
          borderRadius:40,
          marginRight:5,
          backgroundColor:COLORS.darkblue,
          justifyContent:'center',
          alignItems:'center'}}
          onPress={sendMessage}>
            <Ionicons name={'arrow-up'} size={25} color={COLORS.grey} />
        </TouchableOpacity>
      </View>

      </ScrollView>
    </View>
    </KeyboardAvoidingView>
    </BackgroundImage>
  );
};

export default Chatroom;