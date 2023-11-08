import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {child, get, update, push} from "firebase/database";
import {dbRef} from "../../../../../firebaseConfig";
import { Text, View, TextInput, Button, Switch, 
    StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { LinearGradient } from 'expo-linear-gradient';
import { room_updateRoom } from '../../../../Utilities/Firebase/room_functions';
import clouds from  '../../../../../assets/clouds.png'
import raindrops from '../../../../../assets/raindrops.png'
import palmTrees from '../../../../../assets/palmtrees.png'


export const CreateRoom = ()=> {
    
    const [roomName, setRoomName] = useState('');
    const [roomDescription, setRoomDescription] = useState('');
    const [themeImageUrl, setThemeImageUrl] = useState('');
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch1 = () => {
        setIsEnabled(previousState => !previousState);
        setIsOthersAddSongs();
    };

    const [isEnabled2, setIsEnabled2] = useState(false);
    const toggleSwitch2 = () => {
        setIsEnabled2(previousState => !previousState);
        setIsPublic();
    };

    const setIsPublic = () => {
        if (isPublic == 'yes') {
            isPublic = 'no';
            console.log('isPublic is a no')
            //() => setIndex(0);
        } else {
            isPublic = 'yes';
            console.log('isPublic is a yes')
            //() => setIndex(1);
        }
    }

    const setIsOthersAddSongs = () => {
        if (isOthersAddSongs == 'yes') {
            isOthersAddSongs = 'no';
            console.log('isOthersAddSongs is a no')
            //() => setIndex(0);
        } else {
            isOthersAddSongs = 'yes';
            console.log('isOthersAddSongs is a yes')
            //() => setIndex(1);
        }
    }

    const [selectedChoice, setSelectedChoice] = useState(null);
    const handleChoiceClick = (choice) => {
        setSelectedChoice(choice);
        if (choice == 1) {
            setThemeImageUrl('clouds.png');
        } else if (choice == 2) {
            setThemeImageUrl('palmTrees.png');
        } else if (choice == 3) {
            setThemeImageUrl('raindrops.png');
        } else {
            setThemeImageUrl(uploadedImageUrl);
        }
        console.log(themeImageUrl);
      };

    const handleImageClick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })
        if (!result.canceled) {
            setUploadedImageUrl(result.assets[0].uri);
        }
    }

    const handleStartListening = () => {
        console.log(roomName)
        if (roomName != '') {
            console.log('creating room: ' + roomName);
            console.log(roomDescription, themeImageUrl, isPublic, isOthersAddSongs);
            const roomID = push(child(dbRef, '/rooms')).key;
            room_updateRoom({
                roomID: roomID,
                roomName: roomName,
                roomDescription: roomDescription,
                themeImageUrl: themeImageUrl,
                isPublic: isPublic,
                isOthersAddSongs: isOthersAddSongs,
            });
            navigation.navigate('Chatroom', {
                roomID: roomID,
            })
        } else {
            console.log('no room name!');
        }
    }

    useEffect(() => {
        console.log('hello')
        isPublic = 'no';
        isOthersAddSongs = 'no';
        console.log(isPublic, isOthersAddSongs)
    }, [])

    let callNameFunction = (e) => {
        setRoomName(e)
    }

    let callDescFunction = (e) => {
        setRoomDescription(e)
    }

    const [text, onChangeText] = React.useState('');
    const navigation = useNavigation(); // Initialize navigation
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
         <LinearGradient
            colors={['grey', '#42559E', 'black']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.3, 0.6]}
            style={styles.background}/>
            
            <ScrollView>
            <View style={styles.body}>
                <Text style={styles.title}>Create Room</Text>
            </View>
            <View style={styles.body}>
                <Text style={styles.subtitle}>Select a theme</Text>
                <ScrollView
                horizontal={true}
                >
                <TouchableOpacity
                        onPress={() => handleChoiceClick(1)}
                        style={{
                        borderWidth: 3,
                        borderRadius: 10,
                        borderColor: selectedChoice === 1 ? 'white' : 'transparent',
                        }}
                    > 
                <Image style={styles.themeImagestart}
                 source={clouds}
                 />
                </TouchableOpacity>

                <TouchableOpacity
                        onPress={() => handleChoiceClick(2)}
                        style={{
                        marginLeft:25,
                        borderWidth: 3,
                        borderRadius: 10,
                        borderColor: selectedChoice === 2 ? 'white' : 'transparent',
                        }}
                    > 
                <Image style={styles.themeImage}
                 source={palmTrees} 
                 />
                </TouchableOpacity>

                <TouchableOpacity
                        onPress={() => handleChoiceClick(3)}
                        style={{
                        marginLeft:25,
                        borderWidth: 3,
                        borderRadius: 10,
                        borderColor: selectedChoice === 3 ? 'white' : 'transparent',
                        }}
                    > 
                <Image style={styles.themeImage}
                 source={raindrops} 
                 />
                 </TouchableOpacity>
                 <TouchableOpacity
                        onPress={() => handleChoiceClick(4)}
                        style={{
                        marginLeft:25,
                        borderWidth: 3,
                        borderRadius: 10,
                        borderColor: selectedChoice === 4 ? 'white' : 'transparent',
                        }}
                    > 
                <Image style={styles.themeImage}
                 source={themeImageUrl} 
                 />
                 </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.imagebutton}
                            onPress={handleImageClick}
                        >
                            <Text style={styles.buttonPlus}>+</Text>
                            <Text style={styles.buttonPlustext}>Add a theme</Text>
                        </TouchableOpacity>
                 </ScrollView>
                <Text style={styles.name}>Room Name</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={callNameFunction}
                    value={roomName}
                    placeholder="Enter a room name..."
                />
                <Text style={styles.name}>Room Description</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={callDescFunction}
                    value={roomDescription}
                    placeholder="Enter a room description..."
                />
                <Text style={styles.name}>Settings</Text>
                <View
                    style={{
                    flexDirection: 'row',
                    }}>
                <Text style={styles.setting}>Allow listeners to queue songs</Text>
                    <View style={{marginLeft: 130}}>
                        <Switch style={{marginleft: 20}}
                        trackColor={{false: '#767577', true: '#34bdeb'}}
                        thumbColor={isEnabled ? '#83b7eb' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch1}
                        value={isEnabled}
                        />
                    </View>
                </View>
                <View
                    style={{
                    flexDirection: 'row',
                    }}>
                <Text style={styles.setting}>Invites only</Text>
                    <View style={{marginLeft: 260}}>
                        <Switch
                        trackColor={{false: '#767577', true: '#34bdeb'}}
                        thumbColor={isEnabled2 ? '#83b7eb' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch2}
                        value={isEnabled2}
                        />
                    </View>
                </View>
                
                    <TouchableOpacity style={styles.buttonListen} onPress={handleStartListening}>
                        <Text style={styles.buttonText}>Start Listening</Text>
                    </TouchableOpacity>

            </View>
            </ScrollView>
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
        paddingTop: 20,
        marginSide: 20,
    },
    title: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 32,
    },
    subtitle: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 18,
        paddingBottom: 10,
    },
    name: {
        fontWeight: 'bold',
        color: 'white',
        paddingTop: 40,
        fontSize: 18,
    },
    body:{
        paddingLeft: 15,
        paddingTop: 20,
    },
    themeImagestart: {
        width: 80,
        height: 85,
        justifyContent: 'left',
        borderRadius: 10,
    },
    themeImage: {
        width: 80,
        height: 85,
        justifyContent: 'left',
        borderRadius: 10,
    },
    input: {
        height: 40,
        marginRight: 12,
        marginTop: 10,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'grey',
        borderRadius: 5,
    },
    setting: {
        fontSize: 15,
        color: 'white',
        marginTop: 11,
    },
    button: {
        marginTop: 20,
        backgroundColor: 'primary',
        borderRadius: 50,
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    imagebutton: {
        marginTop: 10,
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignSelf: 'center',
        marginLeft:25,
    },
    buttonListen: {
        marginTop: 30,
        backgroundColor: '#83b7eb',
        borderRadius: 50,
        width: 300,
        height: 45,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    buttonBack: {
        marginTop: 10,
        backgroundColor: 'dark',
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
    buttonPlus: {
        color: '#FFFFFF',
        fontSize: 30,
        textAlign: 'center',
    },
    buttonPlustext: {
        color: '#FFFFFF',
        fontSize: 15,
        textAlign: 'center',
    },
    emptyText: {
        fontWeight: 'bold',
        color: 'dark',
        fontSize: 18,
    },
});
