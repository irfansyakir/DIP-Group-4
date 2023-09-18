import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useContext, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";


export const Home = ({navigation}) => {

  const [input, setInput] = useState("");

    // Sample data for songs and playlists
  const recommendedSongs = [
    { id: '1', name: 'Song 1', artist: 'Artist One' },
    { id: '2', name: 'Song 2', artist: 'Artist Two' },
    { id: '3', name: 'Song 3', artist: 'Artist Three' },
    { id: '4', name: 'Song 4', artist: 'Artist Four' },
    { id: '5', name: 'Song 5', artist: 'Artist Five' },
    { id: '6', name: 'Song 6', artist: 'Artist Six' },
    { id: '7', name: 'Song 7', artist: 'Artist Seven' },
  ];

  const recommendedPlaylists = [
    { id: '1', name: 'Playlist 1',songs:10 },
    { id: '2', name: 'Playlist 2',songs:3 },
    { id: '3', name: 'Playlist 3',songs:21 },
    { id: '4', name: 'Playlist 4',songs:19 },
    { id: '5', name: 'Playlist 5',songs:17  },
    { id: '6', name: 'Playlist 6',songs:9 },
    { id: '7', name: 'Playlist 7',songs:8 },
  ];


    return (
        <LinearGradient  colors={["#5c7e91", "#13151E"]} style={{ flex:1 }}>
          <ScrollView style={{flex:1, marginTop:20 }}>
            <View>
              <Text style={{color:"white",marginHorizontal:10,fontSize:17,fontWeight:"bold",marginVertical:10}}>Recently Played</Text>
            </View>

            <ScrollView horizontal={true} style={{flexDirection:"row",marginHorizontal:10}}>

              <FlatList
              horizontal={true}
              data={recommendedSongs}
              keyExtractor={(item) =>item.id}
              renderItem={({item}) =>(
                <TouchableOpacity>
                  <Image 
                  style={{
                    width:100, 
                    height:100,
                    marginRight:10
                    }} 
                    source={{
                      uri: 'https://file-examples.com/storage/fe7bce3209650074f95baa0/2017/10/file_example_PNG_500kB.png'
                    }}
                    />

                    <View>
                    <Text numberOfLines={1} style={{fontWeight:"400",fontSize:16,color:"white"}}>{item.name} </Text>
                    </View>
                </TouchableOpacity>
              )}
               />

            </ScrollView>

            <View>
              <Text style={{fontSize:17,color:"white",fontWeight:"bold",marginHorizontal:10,marginVertical:15}}>Playlists</Text>
            </View>

            <FlatList
            data={recommendedPlaylists}
            keyExtractor={(item) =>item.id}
            renderItem={({item}) =>(
              <TouchableOpacity style={{flexDirection:"row",alignItems:"center",padding:10}}>
                <Image 
                style={{
                  width:50,
                  height:50,
                  marginRight:10
                  }} 
                  source={{
                    uri: 'https://file-examples.com/storage/fe7bce3209650074f95baa0/2017/10/file_example_PNG_500kB.png'
                  }}
                  />

                  <View>
                    <Text numberOfLines={1} style={{fontWeight:"400",fontSize:16,color:"white"}}>{item.name}</Text>
                    <Text style={{marginTop:4,color:"#9A9A9A"}}>{item.songs} songs</Text>
                  </View>
              </TouchableOpacity>

            )}   
            
            />

            <View style={{flexDirection:"row",alignItems:"center"}}>

            <TouchableOpacity style={{width: 55, 
                        height: 50, 
                        width:50, 
                        justifyContent:"center",
                        alignItems:"center",
                        marginHorizontal:10,
                        backgroundColor: "#595861"}}>
            <AntDesign name="plus" size={24} color="white" />

            </TouchableOpacity>

            <Text style={{color:"white",fontSize:15,fontWeight:"bold"}}>Create Playlist</Text>

            </View>

            







          </ScrollView>

        </LinearGradient>
    );
}

