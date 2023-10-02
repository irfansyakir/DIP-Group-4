import { Text, StyleSheet, TouchableOpacity, View, TextInput, FlatList, Image, Pressable} from 'react-native';
import { COLORS, SIZES } from '../../Constants';
import { BoldText, MediumText } from '../../Commons/UI/styledText';
import Ionicons from '@expo/vector-icons/Ionicons'
import {useNavigation, } from "@react-navigation/native";
import { useState } from 'react'
import { useAuthStore } from '../../Store/useAuthStore'
import { SearchTrack } from '../../Utilities/SpotifyApi/Utils'

export const Search = () => {
    const navigation = useNavigation(); // Initialize navigation
    
    return (
        <View style={{ backgroundColor: COLORS.dark ,flex: 1,}}>
            <View style={{padding: 20, paddingTop: 70}}>
            <BoldText style={{color: COLORS.light, fontSize: 25,}}>Search</BoldText>
            <TouchableOpacity style={styles.button} activeOpacity={1} onPress={() => {navigation.navigate('SearchClick')}}>
                <Ionicons
                name={"ios-search"}
                size={25}
                color={COLORS.grey}
                />
                <MediumText style={{marginLeft: 10}}>Artists or Song</MediumText>
            </TouchableOpacity>
            </View>
        </View>
    );
}

// search fr fr
export const SearchClick = () => {
    // Initialize navigation
    const navigation = useNavigation(); 

    const backButton = () => {
        navigation.navigate('SearchTab')
    }

    const handleTrackClick = (trackId) => {
        // Navigate to "YourNewPage" screen when the container is clicked
        const params = { trackId: trackId }
        navigation.navigate('Track', params)
    }

    const [input, setInput] = useState();
    const [data, setData] = useState([]);

    const accessToken = useAuthStore((state) => state.accessToken)
    const onChangeText = async (text) => {
        setInput(text);

        if (text.length==0) setData([]);
        else{
        try{
            const trackdata = await SearchTrack({
                accessToken: accessToken,
                text:text,
            })
            // console.log(trackdata.tracks.items[0].artists[0].name)
            const trackArray = []
            trackdata.tracks.items.map((track) => {
                trackArray.push({
                id: track.id,
                coverUrl: track.album.images[0].url,
                title: track.name,
                artist: track.artists[0].name,
                })
            })
            setData(trackArray)
            
        }catch (error) {
      console.error(error)
        }
        }
    }

    const renderItem = ({ item }) => (
        <Pressable onPress={() => handleTrackClick(item.id)}>
        <View style={{flexDirection:'row', paddingVertical:7, alignItems: 'center'}}>
            {/* SONG IMAGE */}
            <Image style={styles.img} src={item.coverUrl} />
            <View>
                {/* TITLE AND ARTIST */}
                <Text style={{color:'#FFF', fontSize: SIZES.medium,}}>{item.title}</Text>
                <Text style={{color:COLORS.grey}}>{item.artist}</Text>
            </View>
        </View>
        </Pressable>
        
    );

    return (
    <View style={{backgroundColor: COLORS.dark, flex: 1,}}>
    <View style={styles.container}>
        <View style={styles.sbar}>
        <Ionicons
        name={"ios-search"}
        size={25}
        color={COLORS.grey}
        />
        <TextInput
        autoFocus={true}
        style={styles.input}
        placeholder='What do you want to listen to?'
        placeholderTextColor={COLORS.grey}
        value={input}
        onChangeText={onChangeText}
        />
        </View>
        <TouchableOpacity onPress={backButton}>
            <Text style={{color:COLORS.light, marginTop:10}}>cancel</Text>
        </TouchableOpacity>
    </View>

    <View style={{paddingHorizontal:20}}>
    <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
    />
    </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container:{
        padding: 20, 
        paddingTop: 70, 
        flexDirection:'row', 
        justifyContent: 'space-between',
        // alignItems:'center'
    },button:{
        backgroundColor:COLORS.light, 
        padding:10, 
        paddingLeft:20,
        marginTop:15, 
        borderRadius:7, 
        flexDirection:'row', 
        alignItems:'center'
    }, sbar:{
        flexDirection:'row',
        backgroundColor: "#333",
        borderRadius: 10,
        alignItems:'center',
        paddingHorizontal:10
    },input:{
        color: COLORS.light,
        width:250,
        fontSize: SIZES.medium,
        
        padding:10,
        // borderColor: '#bbb',
        // borderWidth: 1,
    },img: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight:15
    },
})
