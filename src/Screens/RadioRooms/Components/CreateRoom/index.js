import React, { useEffect, useState } from "react";
import { Image, Text, View, TextInput, Switch,
    StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView,} from 'react-native';
// import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import {child, get, update, push} from "firebase/database";
import {dbRef} from "../../../../../firebaseConfig";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { LinearGradient } from 'expo-linear-gradient';
import { room_updateRoom } from '../../../../Utilities/Firebase/room_functions';
import clouds from  '../../../../../assets/clouds.png'
import raindrops from '../../../../../assets/raindrops.png'
import palmTrees from '../../../../../assets/palmtrees.png'

import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../../../Constants";
import { BoldText } from "../../../../Commons/UI/styledText";
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const CreateRoom = ()=> {
    const insets = useSafeAreaInsets()
    const [selectedIndex, setIndex] = React.useState(0);

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

    //You c

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
        //since there's no isPublic anywhere else in the code, this means tht u
        //declared isPublic in useEffect. Yeee, don't do this
        //use a useState instead bro
        //const [isPublic, setIsPublic] = useState('no')
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
    const [desc, onChangeDesc] = React.useState('');
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
        paddingTop: insets.top,
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

        <BoldText style={{ color: COLORS.light, fontSize: 25, marginVertical: 10,}}>
          Create Room
        </BoldText>

        <ScrollView>
            <BoldText style={styles.subtitle}>Select a theme</BoldText>
            <ScrollView horizontal={true} style={{paddingBottom: 20}}>
                <Image style={styles.image} source={require('../../../../../assets/clouds.png')} />
                <Image style={styles.image} source={require('../../../../../assets/palmtrees.png')} />
                <Image style={styles.image} source={require('../../../../../assets/raindrops.png')} />
            </ScrollView>

            <BoldText style={styles.subtitle}>Room Name</BoldText>
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
                placeholder="Type a room name..."
                placeholderTextColor={COLORS.grey}
            />
            <BoldText style={styles.subtitle}>Room Description</BoldText>
            <TextInput
                style={styles.input}
                onChangeText={onChangeDesc}
                value={desc}
                placeholder="Type a room description..."
                placeholderTextColor={COLORS.grey}
            />

          <BoldText style={styles.subtitle}>Settings</BoldText>

          <View style = {styles.settingview}>
            <Text style={styles.setting}>Allow listeners to queue songs</Text>
            <TouchableOpacity onPress={()=> setIndex(0)}>
              <View style={styles.radioout}>
                {selectedIndex ==0 ? <View style={styles.radioin}></View>: null}
              </View>
            </TouchableOpacity>
          </View>

          <View style = {styles.settingview}>
            <Text style={styles.setting}>Invites only</Text>
            <TouchableOpacity onPress={()=> setIndex(1)}>
              <View style={styles.radioout}>
                {selectedIndex ==1 ? <View style={styles.radioin}></View>: null}
              </View>
            </TouchableOpacity>
          </View>

          {/* Start Listening Button */}
          <TouchableOpacity style={{
            marginTop: 30,
            backgroundColor: COLORS.primary,
            borderRadius: 50,
            width: '75%',
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
            <BoldText style={{ color: COLORS.darkbluesat, fontSize: SIZES.medium,}}>Start Listening</BoldText>
          </TouchableOpacity>
        </ScrollView>
    </KeyboardAvoidingView>
    </View>

    );
}

export const styles = StyleSheet.create({
  subtitle:{
    color: COLORS.light,
    fontSize: SIZES.medium,
    marginTop: 10,
    marginBottom:10,
  },image:{
    width: 120,
    height:120,
    borderRadius:20,
    marginRight:10,
  }, input: {
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
  }, settingview:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginVertical:10,
    marginRight: 5,
  },radioout:{
    width:35,
    height:35,
    borderColor: COLORS.light,
    borderRadius: 20,
    borderWidth: 2.5,
  }, radioin: {
    backgroundColor: COLORS.primary,
    height: 24,
    width: 24,
    margin: 3,
    borderRadius: 20,
  },
});

