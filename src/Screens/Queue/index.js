import {View, Text, Button, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { Image } from 'expo-image';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Draggable from 'react-native-draggable';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';

export const Queue = ({navigation}) => {

    const [play, setPlay] = useState(false);
    // const songs = [...Array(10).keys()];

    const toggleImage = () => {
      setPlay(!play)
    };

    // Generating list of placeholder songs
    const generateSongs = () => {
        const songs = [];
    
        for (let i = 0; i < 10; i++) {
          songs.push(
                <TouchableOpacity style={styles.songInQ} key={i}>
                <View>
                    <Text style={styles.songName}>Song Name</Text>
                    <Text style={styles.artistName}>Artist Name</Text>
                </View>
                <Image
                    style={styles.draggable}
                    source={require("../../../assets/draggable.png")}
                />
                </TouchableOpacity>
          );
        }
        return songs;
    };

    // Testing draggable reordering of songs
    // const reorderSongs = (fromIndex, toIndex) => {
    //     const updatedSongs = [...songs];
    //     const [movedSong] = updatedSongs.splice(fromIndex, 1);
    //     updatedSongs.splice(toIndex, 0, movedSong);
    //     setSongs(updatedSongs);
    // };

    // const onGestureEvent = (event, index) => {
    // if (event.nativeEvent.translationY > 10 && index > 0) {
    //     // Move down by 10px and swap places
    //     reorderSongs(index, index - 1);
    // } else if (event.nativeEvent.translationY < -10 && index < songs.length - 1) {
    //     // Move up by 10px and swap places
    //     reorderSongs(index, index + 1);
    // }
    // };

    // const onHandlerStateChange = () => {
    //     // Handle the end of the gesture if needed
    //   };

    // const generateSongs = () => {
      
    //     return songs.map((index) => (
    //       <PanGestureHandler
    //         key={index}
    //         onGestureEvent={(event) => onGestureEvent(event, index)}
    //         onHandlerStateChange={onHandlerStateChange}
    //       >
    //         <TouchableOpacity style={styles.songInQ}>
    //           <View>
    //             <Text style={styles.songName}>Song Name</Text>
    //             <Text style={styles.artistName}>Artist Name</Text>
    //           </View>
    //           <Image
    //             style={styles.draggable}
    //             source={require("../../assets/draggable.png")}
    //           />
    //         </TouchableOpacity>
    //       </PanGestureHandler>
    //     ));
    // };
      
    return (
        // <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
            <Text style={styles.header}>Now Playing</Text>
            <View style={styles.playingNow}>
                <Image
                    style={styles.playlistImage}
                    source={require("../../../assets/playlistPic1.png")}
                />
                <View style={styles.songDets}>
                    <Text style={styles.currSong}>Song Name</Text>
                    <Text style={styles.currArtistName}>Artist Name</Text>
                </View>
            </View>
            <Text style={styles.header}>Next In Queue</Text>
            <ScrollView>
                {generateSongs()}
            </ScrollView>
            
            {/* Insert music status bar */}

            <View style={styles.musicPlayer}>
                <TouchableOpacity>
                    <Image
                        style={styles.skip}
                        source={require("../../../assets/skipPrev.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleImage}>
                    <Image
                        style={styles.playCircle}
                        source={require("../../../assets/playCircle.png")}
                    />
                    <Image
                        style={play ? styles.play : styles.pause}
                        source={play ? require("../../../assets/play.png") : require("../../../assets/pause.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                        style={styles.skip}
                        source={require("../../../assets/skipNext.png")}
                    />
                </TouchableOpacity>

            </View>
        </View>
        // </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: 10,
        paddingLeft: 25,
        paddingRight: 25,
        backgroundColor: '#13151e',
    },  
    header: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    playlistImage: {
        width: 81,
        height: 81,
    },
    playingNow: {
        flexDirection: 'row',
        marginBottom: 28,
    },
    songDets: {
        justifyContent: 'center',
        padding: 10,
    },
    currSong: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#41BBC4',
    },
    currArtistName: {
        fontSize: 15,
        color: '#B3B3B3',
    },
    songInQ: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    songName: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    artistName: {
        fontSize: 13,
        color: '#B3B3B3',
    },
    draggable: {
        width: 20,
        height: 10,
    },
    musicPlayer: {
        height: 109, 
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 20,
        alignItems: 'center',
    },  
    skip: {
        width: 29,
        height: 25,
        margin: 30,
    },
    playCircle: {
        width: 60,
        height: 60,
    },
    play: {
        width: 21,
        height: 25,
        position: 'absolute',
        top: 18,
        left: 21,
    },
    pause: {
        width: 20,
        height: 22,
        position: 'absolute',
        top: 19,
        left: 20,
    },
})

