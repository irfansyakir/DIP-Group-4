import React, {useCallback, useEffect, useRef, useState} from 'react'; // Import useRef and useEffect
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
import {LinearGradient} from 'expo-linear-gradient'
import {useAuthStore} from '../../../../Store/useAuthStore'
import MessageBubble from './Components/MessageBubble';
import {GetCurrentUserProfile} from '../../../../Utilities/SpotifyApi/Utils'
import {message_getMessage, message_setMessage} from '../../../../Utilities/Firebase/messages_functions'
import {useMessageListener} from '../../../../Utilities/Firebase/useFirebaseListener';
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {room_getRoom, room_updateRoom} from '../../../../Utilities/Firebase/room_functions';
import {BoldText} from "../../../../Commons/UI/styledText";
import {useMusicStore} from "../../../../Store/useMusicStore";
import {ChatroomMusicPlayer} from "./Components/ChatroomMusicPlayer";
import {useFocusEffect} from "@react-navigation/native";

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

  const currentPage = useMusicStore((state) => state.currentPage)
  const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)

  const [roomUserIDList, setRoomUserIDList] = useState([])
  const [roomDJIDList, setRoomDJIDList] = useState([])

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
    // console.log('Room Name: '+ roomDetails["room_name"]);

    setRoomName(roomDetails["room_name"]);


    //every room MUST have a minimum of 1 user (that is the creator)
    setRoomUserIDList(...roomUserIDList, Object.keys(roomDetails.users))

    // console.log(roomUserIDList)
    setRoomDJIDList(roomDetails["dj"] ? roomDetails["dj"] : [])
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


  //hide the usual musicPlayer if in chatroom. Instead, use the ChatroomMusicPlayer
  //This is if clicking on the player will bring up the Track page, in which the djs can fast forward or something else
  //If so, then TODO: implement fix on how to do the Music Player, Chatroom Music Player, and the Track Page.
  //For now, disabled the ChatroomMusicPlayer pressable
  useFocusEffect(
    useCallback(() => {
      const subscribe = navigation.addListener('focus', () => {
        changeCurrentPage("Chatroom")
      })
      const unsubscribe = navigation.addListener('blur', () => {
        const nextNavigationStateToVisit = navigation.getState()['routes'].at(-1)
        if (nextNavigationStateToVisit['name'] === 'Track'){
          changeCurrentPage("Track")
        } else{
          changeCurrentPage("Not Track")
        }
      })
      return () => {unsubscribe()}
    }, [navigation])
  )

  // call when the screen is first opened
  useEffect(() => {
    // console.log('RoomID: ' + roomID);
    getInitialProfileData();
    getRoomDetails();
    return () => {
      changeCurrentPage("Not Track")
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


  const goToRoomQueue = () => {
    // Handle button press action here for the view queue button
    navigation.navigate('RadioRoomQueue');
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

          {/*RoomName*/}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            {/*<Text style={styles.roomName}>{roomName}</Text>*/}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('RoomDetails', {
                  roomName: roomName,
                  roomUserIDList: roomUserIDList,
                  roomDJIDList: roomDJIDList
                });
              }}
            >
              <BoldText style={styles.roomName}>{roomName}</BoldText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.viewQueueBtn} onPress={goToRoomQueue}>
            <Text style={styles.buttonText}>View Queue</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.musicPlayerContainer}>
          <ChatroomMusicPlayer

          />
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
        <TouchableOpacity
          style={{...styles.viewQueueBtn, marginHorizontal:"50%"}}
          onPress={() => {
            room_updateRoom({
              roomID:roomID,
              isPublic:true,
              dj: [
                "user_id_1",
                "user_id_2"
              ],
              users:{
                user_id_1: {
                  "username": "askofsf"
                },
                user_id_2: {
                  "username": "ghjk"
                },
                user_id_3: {
                  "username": "qwe"
                }
              }
            })
          }}
        >
          <Text style={styles.buttonText}>RoomDetailsTestReset</Text>
        </TouchableOpacity>
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
  musicPlayerContainer: {
    // width: Dimensions.get('window').width - 20,
    marginVertical: 20,
    // marginHorizontal: '50%',
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
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
    marginBottom: '30%',
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