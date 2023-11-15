import {View, Text, Button, StyleSheet, TouchableOpacity, FlatList, PanResponder, Animated, Dimensions} from 'react-native';
import { Image } from 'expo-image';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { createIconSetFromIcoMoon } from '@expo/vector-icons'
import DraggableFlatList from "react-native-draggable-flatlist";
import "react-native-gesture-handler";
import { GestureHandlerRootView, PanGestureHandler, State} from 'react-native-gesture-handler';
import { useQueueStore } from '../../../../Store/useQueueStore'
import { useMusicStore } from '../../../../Store/useMusicStore'
import { red, white } from 'color-name';
import { useUserCurrentQueue } from "../../../../Utilities/Firebase/useFirebaseListener";
import { Play } from '../../../../Commons/Track/play'
import { COLORS } from '../../../../Constants'
import { AuthError } from 'expo-auth-session';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useColorScheme } from 'react-native';

const Icon = createIconSetFromIcoMoon(
    require('../../../../../assets/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
)

export const RoomQueue = ({route, navigation}) => {
    const { roomID, roomName} = route.params || {};

    const storeQueue = useQueueStore((state) => state.queue)
    const storeCurrTrack = useMusicStore((state) => state.songInfo)

    const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)

    const insets = useSafeAreaInsets()

    useEffect(() => {
        changeCurrentPage("Track")
        return () => {
          const nextNavigationStateToVisit = navigation.getState()['routes'].at(-1)
          console.log(nextNavigationStateToVisit)
          if (nextNavigationStateToVisit['name'] === 'Chatroom'){
              changeCurrentPage("Chatroom")
          } else{
            changeCurrentPage("Not Track")
          }
        }
    }, []);

    const generateSongs = () => {
        return (
        <View style={{flex: 1}}>
            <FlatList
            data={storeQueue}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={true}
            renderItem={({ item }) => (
                <View style={styles.songInQ}>
                    <Image
                        style={{
                            width: 45,
                            height: 45,
                            borderRadius: 5
                        }}
                        source={item.img}
                    />
                    <View style={{ paddingLeft: 10 }}>
                        <Text style={styles.songName}>{item.title}</Text>
                        <Text style={styles.artistName}>{item.artist}</Text>
                    </View>
                </View>
            )}/>
        </View>
        );
    };

    return (
        <GestureHandlerRootView style={[styles.container,  {paddingTop: insets.top,}]}>
            <View style={{ flexDirection:'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16, marginBottom: 16, paddingTop: 16}}>
                <TouchableOpacity style={{justifyContent: 'center'}} onPress={() => navigation.goBack()}>
                    <Icon style={styles.icon} name='down'/>
                </TouchableOpacity>
                <Text style={styles.headerTxt}> {roomName} </Text>
                <View style={{height:20, width:20}}></View>
            </View>

            <Text style={[styles.subHeaderTxt, { marginBottom: 5 }]}>Now Playing</Text>
            <View style={styles.playingNow}>
                <Image
                    style={styles.playlistImage}
                    source={storeCurrTrack.coverUrl}
                />
                <View style={styles.songDets}>
                    <Text style={styles.currSong}>
                        {storeCurrTrack.songTitle}
                    </Text>
                    <Text style={styles.currArtistName}>
                        {storeCurrTrack.songArtist}
                    </Text>
                </View>
            </View>

            <Text style={styles.subHeaderTxt}>Next from: {roomName}</Text>
            {generateSongs()}

            <View style={{
                flexDirection: 'row',
                width: '100vw',
                justifyContent: 'space-between',
                marginTop: 10,
            }}>
                <TouchableOpacity
                    style={styles.secButtons}
                    onPress={() => {navigation.navigate('AddSong',  {roomID: roomID})}}
                >
                    <Text style={[styles.subHeaderTxt, {alignSelf: 'center', color: COLORS.dark}]}>Add Songs</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.secButtons, {backgroundColor: COLORS.primary}]}
                    onPress={() => {navigation.navigate('Chatroom', {roomID: roomID})}}
                >
                    <Text style={[styles.subHeaderTxt, {alignSelf: 'center', color: COLORS.dark}]}>Start Listening</Text>
                </TouchableOpacity>
            </View>

            <View style={{height: 150, alignItems: 'center', transform:[{scale: 0.98}]}}><Play/></View>

        </GestureHandlerRootView>

    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: COLORS.dark,
    },
    headerTxt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
        alignSelf: 'center',
    },
    icon:{
        fontSize: 20,
        color: COLORS.white,
    },
    subHeaderTxt: {
        fontSize: 17,
        fontWeight: 'bold',
        color: COLORS.white,
        paddingLeft: 16,
        paddingRight: 16,
    },
    playlistImage: {
        width: 81,
        height: 81,
    },
    playingNow: {
        flexDirection: 'row',
        marginBottom: 20,
        paddingLeft: 16,
        paddingRight: 16,
    },
    songDets: {
        justifyContent: 'center',
        padding: 10,
    },
    currSong: {
        fontSize: 17,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    currArtistName: {
        fontSize: 15,
        color: COLORS.grey,
    },
    songInQ: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        paddingLeft: 16,
        // backgroundColor: 'green'
    },
    songName: {
        fontSize: 17,
        color: COLORS.white,
    },
    artistName: {
        fontSize: 13,
        color: COLORS.grey,
    },
    draggable: {
        width: 20,
        height: 15,
    },
    secButtons:{
        width: 155,
        backgroundColor: COLORS.light,
        borderRadius: 100,
        height: 42,
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 10,
    }
})

