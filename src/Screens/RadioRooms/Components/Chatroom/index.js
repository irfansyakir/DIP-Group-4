import React, { useState, useRef, useEffect } from 'react'; // Import useRef and useEffect
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { BackgroundImage } from '@rneui/base';
import { useAuthStore } from '../../../../Store/useAuthStore'
import MessageBubble from './MessageBubble';
import { GetCurrentUserProfile } from '../../../../Utilities/SpotifyApi/Utils'
import { message_setMessage } from '../../../../Utilities/Firebase/messages_functions'
import { message_getMessage } from '../../../../Utilities/Firebase/messages_functions';
import {useMessageListener} from '../../../../Utilities/Firebase/useFirebaseListener';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {room_getRoom} from '../../../../Utilities/Firebase/room_functions';
import { COLORS, SIZES } from '../../../../Constants';
import { BoldText } from '../../../../Commons/UI/styledText';

export const Chatroom = ({route, navigation}) => {
  const { roomID } = route.params;
  const inset = useSafeAreaInsets();
  const [message, setMessage] = useState(''); // State to store the message text
  const [chatMessages, setChatMessages] = useState([]); // State to store chat messages
  const [username, setUsername] = useState('');
  //const username = 'darkstealthexe'; // use this when unable to log in to spotify
  const scrollViewRef = useRef(); // Create a ref for the ScrollView
  const accessToken = useAuthStore((state) => state.accessToken)
  const [chatRefresh] = useMessageListener(roomID);
  const [roomName, setRoomName] = useState('');
  const [roomImage, setImage] = useState('');

  const getInitialProfileData = async () => {
    // fetch data on load
    try {
      const profileData = await GetCurrentUserProfile({
        accessToken: accessToken,
      })
      setUsername(profileData.display_name)
    } catch (error) {
      //console.error(error)
    }
  }

  const getRoomDetails = async () => {
    const roomDetails = await room_getRoom({roomID: roomID});
    console.log('Room Name: '+ roomDetails["room_name"]);
    setRoomName(roomDetails["room_name"]);
    setImage(roomDetails["image_url"]);
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
        if (obj.username != username) {
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

  // call when the screen is first opened
  useEffect(() => {
    console.log('RoomID: ' + roomID);
    getInitialProfileData();
    getRoomDetails();

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


  const handleButtonPress = () => {
    // Handle button press action here for the view queue button

  };

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

      console.log('sending message: ' + message);
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

  return (
    <BackgroundImage source={require('./background.jpg')} blurRadius={5} style={{
    flex:1, padding:10, paddingTop: inset.top,}}>
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex:1,}}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100} // Adjust the offset as needed
      >

      {/* back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection: 'row', alignItems:'center',}}>
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
        <BoldText style={{fontSize: 25, color: 'white'}}>{roomName}</BoldText>
        <TouchableOpacity style={{
          paddingVertical:8,
          paddingHorizontal:30,
          borderRadius: 20,
          backgroundColor: COLORS.primary,
          justifyContent: 'center',
          alignItems: 'center',}} onPress={handleButtonPress}>
          <BoldText style={{ color: COLORS.darkblue, fontSize: SIZES.medium,}}>View Queue</BoldText>
        </TouchableOpacity>
      </View>

      <ScrollView style={{flex:1, width:'100%',}}>
      {/*disabled for now.*/}
      <View style={{ height: 100,
        backgroundColor: COLORS.darkblue, // Make sure to use a valid color code
        borderRadius: 10,
        marginBottom: 15, alignItems:'center', justifyContent:'center'}}>
       <Text style={{color:'white'}}>Music Player placeholder</Text>
      </View>

      {/* Room Code */}
      <View style={{
        height: 70,
        backgroundColor: COLORS.dark, // Change the color as needed
        borderRadius: 10,
        marginBottom: 15,
        padding:15,}}>
        <Text style={{color: 'white', fontSize: SIZES.small,}}>Room Code</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'}}>
          <BoldText style={{ fontSize: SIZES.large,color: COLORS.light,}}>{roomID}</BoldText>
          <Text style={{fontSize: SIZES.small, color: COLORS.yellow, marginRight:10}}>237 LISTENING</Text>
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