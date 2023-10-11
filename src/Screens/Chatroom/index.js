import React, { useState, useRef, useEffect } from 'react'; // Import useRef and useEffect
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';

import { useAuthStore } from '../../Store/useAuthStore'
import MessageBubble from './MessageBubble';
import { GetCurrentUserProfile } from '../../Utilities/SpotifyApi/Utils'
import {message_setMessage} from '../../Utilities/Firebase/messages_functions'
import { message_getMessage } from '../../Utilities/Firebase/messages_functions';


export const Chatroom = () => {
  const [message, setMessage] = useState(''); // State to store the message text
  const [chatMessages, setChatMessages] = useState([]); // State to store chat messages
  //const [username, setUsername] = useState('') ----> IRFAN PC
  const username = 'darkstealthexe';
  const scrollViewRef = useRef(); // Create a ref for the ScrollView
  const accessToken = useAuthStore((state) => state.accessToken)
  const roomID = '123birds';

  const getInitialProfileData = async () => {
    //console.log('getting profile data');

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

  const getMessages = async () => { 
    try {

      const messages = await message_getMessage({ roomId:roomID});
      

      const newMessagesArray = [];
      let id = 0;
      messages.map(obj => obj.toJSON()).forEach(obj => {

        

        const date = new Date(obj.timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        let right = true;

        

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

        console.log(newMessage);
        //console.log(newMessage)
        newMessagesArray.push(newMessage);
        
      })

      setChatMessages(newMessagesArray);
      
      // Now you can work with the sorted messages
    } catch (error) {
      console.error("Error while getting messages:", error);
    }

  }

  useEffect(() => {
    getInitialProfileData();
  }, [])

  useEffect(() => {
    getMessages()
  }, [username])

  // Use useEffect to scroll to the bottom when chatMessages change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);


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

      console.log('sending message: ' + message);
      message_setMessage( {
          roomId: roomID,
          username: username,
          message: message,
          timestamp: now.getTime(),
      });

      // Update the chatMessages state with the new message
      setChatMessages([...chatMessages, newMessage]);

      // Clear the input field
      setMessage('');

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }
  };
  

  


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'position' : 'position'} // Use 'position' behavior for both platforms
          keyboardVerticalOffset={0} // Set the offset to 0
        >
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <Text style={styles.roomName}>Room Name</Text>
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
                 <Text style={styles.roomCode}>rkaiRnl</Text>
                 <Text style={styles.numberListening}>237 LISTENING</Text>
                </View>
            </View>
            

            <ScrollView
              style={styles.chatbox} // Apply styles to the ScrollView
              ref={scrollViewRef} // Use the ref here
              contentContainerStyle={{ flexGrow: 1 }} // Allow the content to grow within the ScrollView
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
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );

  
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
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
    fontWeight: '700',
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
    fontWeight: 'bold',
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
    fontSize: 12,
    fontWeight: 400,
    marginTop: 7,
    marginLeft: 16
  },

  roomCode: {
    fontSize: 17,
    color: 'white',
    fontWeight: 700,
    marginTop: 8,
    marginLeft: 16
  },

  numberListening : {
    fontSize: 10,
    color: '#FFE457',
    marginLeft: 240,
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
});

export default Chatroom;
