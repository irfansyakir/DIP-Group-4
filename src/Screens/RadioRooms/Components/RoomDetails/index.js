import React, { useEffect, useState } from "react";
import { Image, Text, View, FlatList, Switch,
    StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView,} from 'react-native';
// import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { LinearGradient } from 'expo-linear-gradient';
import { room_updateRoom, room_fetchDJList, room_fetchDJUrlList, room_fetchUserList, room_fetchUserUrlList } from '../../../../Utilities/Firebase/room_functions';
import clouds from  '../../../../../assets/clouds.png'
import raindrops from '../../../../../assets/raindrops.png'
import palmTrees from '../../../../../assets/palmtrees.png'

import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../../../Constants";
import { BoldText } from "../../../../Commons/UI/styledText";
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { room_getRoom } from '../../../../Utilities/Firebase/room_functions';

export const RoomDetails = ({route, navigation}) => {
    //can just make this page look like the telegram room details
    const { roomID } = route.params;
    //const { roomName, roomUserIDList, roomDJIDList } = route.params;
    const [roomName, setRoomName] = useState('')
    const [roomDescription, setRoomDescription] = useState('')
    const [roomThemeImgURL, setRoomThemeImgURL] = useState('')
    const [roomUserIDList, setRoomUserIDList] = useState([])
    const [roomProfileUrlList, setRoomProfileUrlList] = useState([])
    const [roomDJIDList, setRoomDJIDList] = useState([])
    const [roomDJProfileUrlList, setRoomDJProfileUrlList] = useState([])
    const insets = useSafeAreaInsets()

    useEffect(() => {
        getRoomDetails()
        console.log('roomID: ', roomID)
        console.log('roomname: ', roomName)
        console.log('roomdescription: ', roomDescription)
        console.log('roomthemeURL: ', roomThemeImgURL)
        console.log('roomUserIDs: ', roomUserIDList)
        console.log('roomProfileUrls: ', roomProfileUrlList)
        console.log('roomDJs: ', roomDJIDList)
        console.log('roomDJProfileUrls: ', roomDJProfileUrlList)
    }, []);

    const handleButtonClick = () => {
      navigation.goBack()
    }

    const handleBackClick = () => {
      navigation.navigate('Chatroom', {
        roomID: roomID,
      })
    }

    const getRoomDetails = async () => {
      const roomDetails = await room_getRoom({roomID: roomID});
      // console.log('Room Name: '+ roomDetails["room_name"]);
      setRoomName(roomDetails["room_name"]);
      setRoomDescription(roomDetails["room_description"]);
      themeImageUrl = roomDetails["themeImageUrl"]
      if (themeImageUrl == 'clouds') {
        setRoomThemeImgURL(clouds);
      } else if (themeImageUrl == 'raindrops') {
        setRoomThemeImgURL(raindrops);
      } else if (themeImageUrl == 'palmTrees') {
        setRoomThemeImgURL(palmTrees);
      } else {
        setRoomThemeImgURL(themeImageUrl);
      }
      const DJIDList = await room_fetchDJList({roomID: roomID});
      setRoomDJIDList(DJIDList);
      const DJProfileUrlList = await room_fetchDJUrlList({roomID: roomID});
      setRoomDJProfileUrlList(DJProfileUrlList);
      const UserIDList = await room_fetchUserList({roomID: roomID});
      setRoomUserIDList(UserIDList);
      const UserUrlList = await room_fetchUserUrlList({roomID: roomID});
      setRoomProfileUrlList(UserUrlList);
      //setRoomUserIDList(fetchDJNames());
      //every room MUST have a minimum of 1 user (that is the creator)
      //setRoomUserIDList(roomDetails["users"] ? roomDetails["users"] : [])
      //setRoomUserIDList(roomDetails["users"]["../username"] ? roomDetails["users"]["../username"] : [])
      //setRoomProfileUrlList(roomDetails["users"]["profileUrl"] ? roomDetails["users"]["profileUrl"] : [])
      // console.log(roomUserIDList)
      //setRoomDJIDList(roomDetails["dj"]["username"] ? roomDetails["dj"]["username"] : [])
      //setRoomDJProfileUrlList(roomDetails["dj"]["profileUrl"] ? roomDetails["dj"]["profileUrl"] : [])
    }

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
      
        <TouchableOpacity onPress={handleBackClick} style={{flexDirection: 'row', alignItems:'center',}}>
        <Ionicons name='chevron-back' size={30} color={COLORS.grey} />
        </TouchableOpacity>

        <ScrollView>
        <Image style={styles.image} source={roomThemeImgURL} />

        <BoldText style={{ color: COLORS.light, fontSize: 25, alignSelf: 'center',}}>
          {roomName}
        </BoldText>

        <Text style={{ color: COLORS.light, fontSize: 15, alignSelf: 'center',}}>
          {roomDescription}
        </Text>

        <View>
        <Text style={{ color: COLORS.light, fontSize: 15, paddingVertical: 6, marginLeft: 10}}>DJs:</Text></View>
        <View style={styles.header}>
        <FlatList
          data={roomDJIDList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.row} key={index}>
              <Image
                source={{ uri: roomDJProfileUrlList[index] }}
                style={styles.profileImage}
              />
              <Text style={styles.text}>{`${item}`}</Text>
            </View>
          )}
        />

        </View>
        <View>
        <Text style={{ color: COLORS.light, fontSize: 15, paddingVertical: 6, marginLeft: 10}}>Users:</Text></View>
        <View style={styles.header1}>
        <FlatList
          data={roomUserIDList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.row} key={index}>
              <Image
                source={{ uri: roomProfileUrlList[index] }}
                style={styles.profileImage}
              />
              <Text style={styles.text}>{`${item}`}</Text>
            </View>
          )}
        />

        </View>

        <TouchableOpacity
            style={{
              marginTop: 30,
              backgroundColor: COLORS.primary,
              borderRadius: 50,
              width: '75%',
              height: 45,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}
            onPress={handleButtonClick}
          >
            <BoldText style={{ color: COLORS.darkbluesat, fontSize: SIZES.medium,}}>Leave Group</BoldText>
          </TouchableOpacity>

        </ScrollView>
        </KeyboardAvoidingView>
    </View>
    )
}
export const styles = StyleSheet.create({
  image:{
    width: 120,
    height:120,
    borderRadius: 20,
    marginBottom: 25,
    alignSelf: 'center',
  },
  header: {
    backgroundColor: 'white',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 10,
    marginTop: 25,
    justifyContent: 'left',
    flexDirection: 'row',
},
  header1: {
    backgroundColor: 'white',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    padding: 10,
    justifyContent: 'left',
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  text: {
    color: COLORS.dark,
    fontSize: 15,
    marginLeft: 10,
  },
  profileImage: {
    width: 50, // Adjust the width as needed
    height: 50, // Adjust the height as needed
    marginRight: 10, // Add margin to separate image and text
  },
});
