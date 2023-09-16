import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { useFonts } from 'expo-font';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';

const Icon = createIconSetFromIcoMoon(
    require('../../../assets/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);
  
export const TopBar = () => {
    const [fontsLoaded] = useFonts({
      IcoMoon: require('../../../assets/icomoon/icomoon.ttf'),
    });
    if (!fontsLoaded) {
      return null;
    }
  
    return (
    <View style={styles.topbar}>
        <TouchableOpacity onPress={()=>console.log('helo')}>
        <Icon style={styles.icon} name='down' size={20}/>
        </TouchableOpacity>

        <Text style={styles.headtxt}>Album/Playlist Name</Text>

        <TouchableOpacity onPress={()=>console.log('more')}>
        <Icon style={styles.icon} name='more' size={25} />
        </TouchableOpacity>
    </View>
    );
}
  
  const styles = StyleSheet.create({
    topbar:{
        flex: 1,
        flexDirection:'row',
        justifyContent:'space-between',
        height:'auto',
        width:350,
        marginTop:60,
    },icon:{
        color:'#FFF',
    },headtxt:{
        color: '#FFF',
        /* Heading 3 */
        fontSize: 14,
        fontWeight: 'bold',
        width: 100,
        textAlign: 'center',
      },
});