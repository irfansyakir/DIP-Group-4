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
import { useQueueStore } from '../../Store/useQueueStore'
import { useMusicStore } from '../../Store/useMusicStore'
import { red, white } from 'color-name';
import { useUserCurrentQueue } from "../../Utilities/Firebase/useFirebaseListener";
import { Play } from '../../Commons/Track/play'
import { COLORS } from '../../Constants'

const Icon = createIconSetFromIcoMoon(
    require('../../../assets/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
)

export const Queue = ({navigation}) => {

    const storeQueue = useQueueStore((state) => state.queue)
    const changeQueue = useQueueStore((state) => state.changeQueue)
    const storeCurrTrack = useMusicStore((state) => state.songInfo)

    // Generating list of songs from store
    const generateSongs = () => {        
        return (
        <DraggableFlatList
          data={storeQueue}
          onDragEnd={({data}) => {changeQueue(data)}}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={{ height: (47/100)*Math.round(Dimensions.get('window').height)}}
          renderItem={({ item, drag, isActive }) => (
            <View style={[styles.songInQ,
                {backgroundColor: isActive ? COLORS.secondary : item.backgroundColor}
            ]}
            >
                <View> 
                    <Text style={styles.songName}>{item.title}</Text>
                    <Text style={styles.artistName}>{item.artist}</Text>
                </View>
                <TouchableOpacity 
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: 52,
                    }}
                    onLongPress={drag}
                    delayLongPress={300}
                    disabled={isActive}
                >
                    <Image
                        style={styles.draggable}
                        source={require("../../../assets/draggable.png")}
                    />
                </TouchableOpacity>
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
            <Text style={styles.headerTxt}> Queue </Text>
            
            <Text style={styles.subHeaderTxt}>Now Playing</Text>
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
            
            <Text style={styles.subHeaderTxt}>Next In Queue</Text>
            {generateSongs()}

            <Play/>

        </GestureHandlerRootView>
        
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 10,
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
        marginBottom: 10,
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
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        paddingLeft: 16,
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

