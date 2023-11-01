import React, { useEffect, useState } from 'react';
import {child, get, update, push} from "firebase/database";
import {dbRef} from "../../../../../firebaseConfig";
//import { Image } from 'expo-image';
import { Image, Text, View, TextInput, Button, 
    StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { CheckBox } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { room_updateRoom } from '../../../../Utilities/Firebase/room_functions';

import clouds from  '../../../../../assets/clouds.png'
import raindrops from '../../../../../assets/raindrops.png'
import palmTrees from '../../../../../assets/palmtrees.png'

import {Stack} from "@rneui/layout";


export const CreateRoom = ()=> {
    
    const [selectedIndex, setIndex] = React.useState(0);
    const [roomName, setRoomName] = useState('');
    const [roomDescription, setRoomDescription] = useState('');
    const navigation = useNavigation(); // Initialize navigation

    const handleStartListening = () => {
        console.log(roomName)
        if (roomName != '') {
            console.log('creating room: ' + roomName);
            console.log(roomDescription, isPublic);
            const roomID = push(child(dbRef, `/rooms`)).key;
            room_updateRoom({
                roomID: roomID,
                roomName: roomName,
                roomDescription: roomDescription,
                isPublic: isPublic,
            });
            navigation.navigate('Chatroom', {
                roomID: roomID,
            })
        } else {
            console.log('no room name!');
        }
    }

    const setIsPublic = () => {
        if (isPublic) {
            isPublic = false;
            console.log('isPublic is false!')
            //() => setIndex(0);
        } else {
            isPublic = true;
            console.log('isPublic is true!')
            //() => setIndex(1);
        }
    }

    useEffect(() => {
        console.log('hello')
        isPublic = true;
        console.log(isPublic)
    }, [])

    let callNameFunction = (e) => {
        setRoomName(e)
    }

    let callDescFunction = (e) => {
        setRoomDescription(e)
    }
  /*  const showMessage = () => {
        const customMessage = "You are about to leave the page.";
        Alert.alert(
          "Save Changes?",
          customMessage, // Set your custom message here
          [
            {
                text: "Yes",
                onPress: () => navigation.navigate('Profile'),
            },
            {
                text: "Cancel",
                onPress: () => console.log('No Pressed'),
            }
          ],
          { cancelable: true }
        );
      };

    const handleContainerClick = () => {
        // Navigate to "YourNewPage" screen when the container is clicked
        navigation.navigate('"Room"Room');
    };
*/
    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text>Create Room</Text>
            </View>
            <View style={styles.subtitle}>
            <ScrollView>
                <Text>Select a theme</Text>
                <Image
                    source={clouds} />
                <Image
                    source={palmTrees} />
                <Image
                    source={raindrops} />
                <Text style={styles.subtitle}>Room Name</Text>
                <TextInput
                    style={styles.input}
                    value={roomName}
                    onChangeText={callNameFunction}
                    placeholder="Type a room name..."
                />
                <Text style={styles.subtitle}>Room Description</Text>
                <TextInput
                    style={styles.input}
                    value={roomDescription}
                    onChangeText={callDescFunction}
                    placeholder="Type a room description..."
                />
                <Text style={styles.subtitle}>Settings</Text>
                <Text style={styles.setting}>Allow listeners to queue songs</Text>
                <Stack row align="right" spacing={2}>
                    <CheckBox
                    checked={selectedIndex === 0}
                    onPress={setIsPublic}
                    iconType="material-community"
                    checkedIcon="radiobox-marked"
                    uncheckedIcon="radiobox-blank"
                    />
                </Stack>
                <Text style={styles.setting}>Invites only</Text>
                <Stack row align="right" spacing={2}>
                    <CheckBox
                    checked={selectedIndex === 1}
                    onPress={setIsPublic}
                    iconType="material-community"
                    checkedIcon="radiobox-marked"
                    uncheckedIcon="radiobox-blank"
                    />
                </Stack>
                <View>
                    <TouchableOpacity style={styles.buttonListen} onPress={handleStartListening}>
                        <Text style={styles.buttonText}>Start Listening</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            </View>
        </View>
       
        
            
    );
}

export const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    container: {
        flex: 1,
        justifyContent: 'start',//'space-between'
        paddingTop: 80,
        marginSide: 20,
    },
    title: {
        fontWeight: 'bold',
        color: 'white',
        paddingLeft: 15,
        fontSize: 20,
        paddingTop: 20,
    },
    subtitle: {
        fontWeight: 'bold',
        color: 'white',
        paddingLeft: 15,
        fontSize: 18,
        paddingTop: 20,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'slategrey',
        borderRadius: 5,
    },
    setting: {
        fontSize: 9,
        color: 'white',

    },
    button: {
        marginTop: 20,
        backgroundColor: '#41BBC4',
        borderRadius: 50,
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    buttonListen: {
        marginTop: 30,
        backgroundColor: '#41BBC4',
        borderRadius: 50,
        width: 300,
        height: 45,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    buttonBack: {
        marginTop: 10,
        backgroundColor: '#13151E',
        borderRadius: 50,
        width: 40,
        height: 40,
        paddingLeft: 0,
    },
    buttonText: {
        color: '#181414',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
    },
    emptyText: {
        fontWeight: 'bold',
        color: '#13151E',
        paddingLeft: 15,
        fontSize: 18,
    },
});
