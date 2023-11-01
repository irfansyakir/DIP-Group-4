import React, { useState, useRef, useEffect } from 'react'; // Import useRef and useEffect
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuthStore } from '../../../../Store/useAuthStore'
import MessageBubble from './MessageBubble';
import background from './background.jpg';
import { GetCurrentUserProfile } from '../../../../Utilities/SpotifyApi/Utils'
import { message_setMessage } from '../../../../Utilities/Firebase/messages_functions'
import { message_getMessage } from '../../../../Utilities/Firebase/messages_functions';
import {useMessageListener} from '../../../../Utilities/Firebase/useFirebaseListener';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {room_getRoom} from '../../../../Utilities/Firebase/room_functions';

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: inset.top,
      }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100} // Adjust the offset as needed
    >
      <LinearGradient
        colors={['#6369D1', '#42559E', '#101010']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.3, 0.6]}
        style={styles.background}
      />

      <View >


        <View style={styles.topContainer}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.roomName}>{roomName}</Text>
          </View>
          <TouchableOpacity style={styles.viewQueueBtn} onPress={handleButtonPress}>
            <Text style={styles.buttonText}>View Queue</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.musicPlayer}>
          <Text>Music Player</Text>
        </View>

        <View style={styles.roomCodeView}>
          <Text style={styles.roomCodeTitle}>Room Code</Text>
          <View style={styles.roomCodeContainer}>
            <Text style={styles.roomCode}>{roomID}</Text>
            <Text style={styles.numberListening}>237 LISTENING</Text>
          </View>
        </View>

        <ScrollView
          style={styles.chatbox} // Apply styles to the ScrollView
          ref={scrollViewRef} // Use the ref here
          keyboardShouldPersistTaps="handled"
        >
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

        <TextInput
          style={styles.message}
          placeholder="Message..."
          multiline={false} // Set to false for a single-line input
          placeholderTextColor="#888"
          returnKeyType="done"
          onChangeText={(text) => setMessage(text)}
          value={message}
          onSubmitEditing={sendMessage}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Purple_website.svg/1200px-Purple_website.svg.png")',
  },
  topContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  roomName: {
    fontSize: 25,
    marginLeft: 22,
    marginRight: 88,
  },

  viewQueueBtn: {
    width: 150,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#41BBC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 24,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
  musicPlayer: {
    width: 380,
    height: 114,
    backgroundColor: '#303847', // Make sure to use a valid color code
    borderRadius: 10,
    marginLeft: 22,
    marginRight: 22,
    marginBottom: 20,
  },
  roomCodeView: {
    width: 380,
    height: 64,
    backgroundColor: '#13151E', // Change the color as needed
    borderRadius: 10,
    marginLeft: 22,
    marginRight: 22,
    marginBottom: 20,
  },

  roomCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  roomCodeTitle: {
    color: 'white',
    fontSize: 10,
    marginTop: 7,
    marginLeft: 16
  },

  roomCode: {
    fontSize: 20,
    color: 'white',
    marginTop: 4,
    marginLeft: 16
  },

  numberListening : {
    fontSize: 10,
    color: '#FFE457',
    marginLeft: 200,
    marginRight: 10
  },

  chatbox: {
    width: 380,
    height: 250,
    backgroundColor: '#343434', // Change the color as needed
    borderRadius: 10,
    marginLeft: 22,
    marginRight: 22,
    marginBottom: 20,
  },
  message: {
    width: 380,
    height: 60,
    color: '#888',
    backgroundColor: '#343434', // Change the color as needed
    borderRadius: 10,
    marginLeft: 22,
    marginRight: 22,
    paddingLeft: 10, // Add some left padding for the text input
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default Chatroom;