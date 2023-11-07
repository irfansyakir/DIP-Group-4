import React, { useState } from "react";
import { Image, Text, View, TextInput,
    StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView,} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../../../Constants";
import { BoldText } from "../../../../Commons/UI/styledText";
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const CreateRoom = ()=> {
    const insets = useSafeAreaInsets()
    const [selectedIndex, setIndex] = React.useState(0);
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
