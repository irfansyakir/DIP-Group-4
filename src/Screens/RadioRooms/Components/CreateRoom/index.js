import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {child, get, update, push} from "firebase/database";
import {dbRef} from "../../../../../firebaseConfig";
import { Text, View, TextInput, Button, Switch, 
    StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView,} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { LinearGradient } from 'expo-linear-gradient';
import { room_updateRoom } from '../../../../Utilities/Firebase/room_functions';
import clouds from  '../../../../../assets/clouds.png'
import raindrops from '../../../../../assets/raindrops.png'
import palmTrees from '../../../../../assets/palmtrees.png'
import questionMark from '../../../../../assets/questionmark.png'
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../../../Constants";
import { BoldText } from "../../../../Commons/UI/styledText";
import { useSafeAreaInsets } from 'react-native-safe-area-context'


export const CreateRoom = ()=> {
    const insets = useSafeAreaInsets()
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
            console.log('isPublic is a no blah')
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
        setUploadedImageUrl(questionMark);
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
        <View style={{
            flex: 1,
            justifyContent: 'start',
            backgroundColor: COLORS.dark,
            paddingTop: insets.top + 20,
            padding: 20,
        }}>
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex:1,}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100} // Adjust the offset as needed
        >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection: 'row', alignItems:'center',}}>
        <Ionicons name='chevron-back' size={30} color={COLORS.grey} />
        </TouchableOpacity>
            <ScrollView>
            <BoldText style={{ color: COLORS.light, fontSize: 25, marginVertical: 10,}}>
                Create Room
            </BoldText>
                <BoldText style={styles.subtitle}>Select a theme</BoldText>
                <ScrollView
                horizontal={true} style={{paddingBottom: 20}}
                >
                <TouchableOpacity
                        onPress={() => handleChoiceClick(1)}
                        style={[
                            styles.imageFormat,
                            {borderColor: selectedChoice === 1 ? COLORS.primary : 'transparent'},
                        ]}
                    > 
                <Image style={styles.themeImage}
                 source={clouds}
                 />
                </TouchableOpacity>

                <TouchableOpacity
                        onPress={() => handleChoiceClick(2)}
                        style={[
                            styles.imageFormat,
                            {borderColor: selectedChoice === 2 ? COLORS.primary : 'transparent'},
                            ]}
                    > 
                <Image style={styles.themeImage}
                 source={palmTrees} 
                 />
                </TouchableOpacity>

                <TouchableOpacity
                        onPress={() => handleChoiceClick(3)}
                        style={[
                            styles.imageFormat,
                            {borderColor: selectedChoice === 3 ? COLORS.primary : 'transparent'},
                            ]}
                    > 
                <Image style={styles.themeImage}
                 source={raindrops} 
                 />
                 </TouchableOpacity>
                 <TouchableOpacity
                        onPress={() => handleChoiceClick(4)}
                        style={[
                            styles.imageFormat,
                            {borderColor: selectedChoice === 4 ? COLORS.primary : 'transparent'},
                            ]}
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
                <BoldText style={styles.subtitle}>Room Name</BoldText>
                <TextInput
                    style={styles.input}
                    onChangeText={callNameFunction}
                    value={roomName}
                    placeholder="Type a room name..."
                    placeholderTextColor={COLORS.grey}
                />
                <BoldText style={styles.subtitle}>Room Description</BoldText>
                <TextInput
                    style={styles.input}
                    onChangeText={callDescFunction}
                    value={roomDescription}
                    placeholder="Type a room description..."
                    placeholderTextColor={COLORS.grey}
                />
                <BoldText style={styles.subtitle}>Settings</BoldText>
                <View
                    style={styles.settingview}>
                <Text style={styles.setting}>Allow listeners to queue songs</Text>
                    <View>
                        <Switch
                        style={{ transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
                        trackColor={{false: '#767577', true: '#767577'}}
                        thumbColor={isEnabled ? COLORS.primary : COLORS.light}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch1}
                        value={isEnabled}
                        />
                    </View>
                </View>
                <View
                    style={styles.settingview}>
                <Text style={styles.setting}>Invites only</Text>
                    <View>
                        <Switch
                        style={{ transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
                        trackColor={{false: '#767577', true: '#767577'}}
                        thumbColor={isEnabled2 ? COLORS.primary : COLORS.light}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch2}
                        value={isEnabled2}
                        />
                    </View>
                </View>
                
                    <TouchableOpacity style={styles.buttonListen} onPress={handleStartListening}>
                    <BoldText style={{ color: COLORS.darkbluesat, fontSize: SIZES.medium,}}>Start Listening</BoldText>
                    </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
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
        color: COLORS.light, 
        fontSize: SIZES.medium, 
        marginTop: 10,
        marginBottom: 10,
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
    themeImage: {
        width: 120,
        height: 120,
        borderRadius: 15,
    },
    input: {
        color: COLORS.light,
        fontSize: SIZES.sm,
        height: 40,
        padding: 10,
        backgroundColor: COLORS.darkgrey,
        borderRadius: 5,
        marginBottom:15,
    },
    setting: {
        fontSize: SIZES.medium,
        color: COLORS.light,
    },
    imageFormat: {
        marginRight: 5,
        borderWidth: 5,
        borderRadius: 20,
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
    settingview:{
        flexDirection:'row', 
        justifyContent:'space-between', 
        alignItems:'center', 
        marginVertical:10,
        marginRight: 5,
    },
    imagebutton: {
        marginTop: 10,
        borderRadius: 50,
        width: 60,
        height: 80,
        justifyContent: 'center',
        alignSelf: 'center',
        marginLeft:25,
    },
    buttonListen: {
        marginTop: 30,
        backgroundColor: COLORS.primary,
        borderRadius: 50,
        width: '75%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
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
        color: COLORS.light, 
        fontSize: SIZES.xxLarge, 
        marginTop: 1,
        marginBottom: 1,
        textAlign: 'center',
    },
    buttonPlustext: {
        color: COLORS.light, 
        fontSize: SIZES.medium, 
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyText: {
        fontWeight: 'bold',
        color: 'dark',
        fontSize: 18,
    },
});
