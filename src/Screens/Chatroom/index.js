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
  FlatList,
  ScrollView,
} from 'react-native';
import * as FileSystem from 'expo-file-system'; // Import the FileSystem module
const chatMessagesFilePath = `${FileSystem.documentDirectory}chat_messages.txt`;


import MessageBubble from './MessageBubble'; // Import the MessageBubble component


export const Chatroom = () => {
  const [message, setMessage] = useState(''); // State to store the message text
  const [chatMessages, setChatMessages] = useState([]); // State to store chat messages
  const scrollViewRef = useRef(); // Create a ref for the ScrollView


  const handleButtonPress = () => {
    // Handle button press action here
  };

  // Function to load messages from the text file
  const loadMessagesFromFile = async () => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(
        chatMessagesFilePath,
        { encoding: FileSystem.EncodingType.UTF8 }
      );

      if (fileContent) {
        const messages = fileContent.split('\n').filter((message) => message.trim() !== '');

        // Populate the chatMessages state with the messages from the file
        setChatMessages(messages.map((text, id) => ({ text, id: id.toString() })));
      }
    } catch (error) {
      console.error('Error reading messages from file:', error);
    }
  };

  const sendMessage = async () => {
    if (message.trim() !== '') {
      const newMessage = {
        text: message,
        id: chatMessages.length.toString(),
      };
  
      // Update the chatMessages state with the new message
      setChatMessages([...chatMessages, newMessage]);
  
      // Save the message to the text file
      try {
        await FileSystem.writeAsStringAsync(
          chatMessagesFilePath,
          `${message}\n`,
          { encoding: FileSystem.EncodingType.UTF8, append: true }
        );
      } catch (error) {
        console.error('Error saving message to file:', error);
      }
  
      // Clear the input field
      setMessage('');
    }
  };
  

  // Use useEffect to scroll to the bottom when chatMessages change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);

  // Load messages from the file when the component mounts
  useEffect(() => {
    loadMessagesFromFile();
  }, []); // Empty dependency array to load messages only once when the component mounts


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
                <MessageBubble key={messageItem.id} text={messageItem.text} />
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
});

export default Chatroom;
