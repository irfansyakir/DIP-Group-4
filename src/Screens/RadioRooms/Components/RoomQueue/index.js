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

const Icon = createIconSetFromIcoMoon(
    require('../../../../../assets/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
)

export const RoomQueue = ({navigation}) => {

    const storeQueue = useQueueStore((state) => state.queue)
    const changeQueue = useQueueStore((state) => state.changeQueue)
    const storeCurrTrack = useMusicStore((state) => state.songInfo)

    const generateSongs = () => {        
        return (
        <FlatList
          data={storeQueue}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
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
        );
    };
    
    return (
        <GestureHandlerRootView style={styles.container}>
            <TouchableOpacity style={{
                position: 'absolute',
                top: 25,
                left: 26,
                width: 20,
                height: 20,
                backgroundColor: 'red'
            }} onPress={() => navigation.goBack()}>
                {/* <Icon style={styles.icon} name='down'/> */}
            </TouchableOpacity>
            <Text style={styles.headerTxt}> ROOM NAME </Text>
            
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
            
            <Text style={styles.subHeaderTxt}>Next from: ROOM NAME</Text>
            {generateSongs()}

        </GestureHandlerRootView>
        
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#13151e',
    },  
    headerTxt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
        alignSelf: 'center',
        margin: 10,
    },
    icon:{
        fontSize: 20,
        color: COLORS.white,
    },
    subHeaderTxt: {
        fontSize: 17,
        fontWeight: 'bold',
        color: COLORS.white,
        // marginBottom: 10,
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
    }
})

