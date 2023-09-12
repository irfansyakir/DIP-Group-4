import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';


const Icon = createIconSetFromIcoMoon(
  require('../../../assets/icomoon/selection.json'),
  'IcoMoon',
  'icomoon.ttf'
);

const Item = props => {
return(
<TouchableOpacity style={styles.segment} onPress={() => console.log('hehe')} > 
  <Icon style={styles.icon} name={props.iconname} size={20} color="white" />
  <Text style={styles.text}>{props.text}</Text>
</TouchableOpacity>
)
}

export const TrackInfo = () => {

  const [fontsLoaded] = useFonts({
    IcoMoon: require('../../../assets/icomoon/icomoon.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
  <View style={styles.container}>
    <LinearGradient
      colors={['#121212', '#5C4C3F', '#9A7E66']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      locations={[0.6, 0.8, 1]}
      style={styles.linearGradient}
    >
      <Image style={styles.img} source ={ require('../../../assets/songimgtest.jpg')}/>
      <Text style={styles.title}>Nightlight</Text>
      <Text style={styles.desc}>crescent moon • Album name</Text>

    {/* album, hide, addsong, addqueue, user, users */}
      <Item text='Hide song' iconname = 'hide'></Item>
      <Item text='Add to playlist' iconname = 'addsong'></Item>
      <Item text='Add to queue' iconname = 'addqueue'></Item>
      <Item text='View album' iconname = 'album'></Item>
      <Item text='View artist' iconname = 'user'></Item>
      <Item text='Song credits' iconname = 'users'></Item>

      <TouchableOpacity style={styles.segment1} onPress={() => console.log('bye')} > 
        <Text style={styles.text}>Close</Text>
      </TouchableOpacity>
    </LinearGradient>
  </View>

  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      
    },linearGradient: {
      flex: 1,
      alignItems: 'center',
      // justifyContent: 'center',
    }, title:{
      color: '#FFF',
      textAlign: 'center',
      marginTop:30,
      /* Heading 2 */
      fontSize: 17,
      fontWeight: 'bold',
    }, desc:{
      color: '#B3B3B3',
      marginTop:5,
      marginBottom:32,
      /* Body 3 */
      fontSize: 15,
    }, segment:{
      display: 'flex',
      flexDirection:  'row',
      width:320,
      padding: 16,

      // CHECK SIZE OF SEGMENT
      // borderColor: '#bbb',
      // borderWidth: 1,
      // borderStyle: "dashed",
      // borderRadius: 10,
    },text:{
      color: '#FFF',
      fontSize: 16,
    }, img:{
      width: 164,
      height: 164,
      borderRadius:10,
      marginTop:100,
    }, icon:{
      marginRight:15,
    }, segment1:{
      display: 'flex',
      flexDirection:  'row',
      padding: 16,
      bottom: -90
    },
});