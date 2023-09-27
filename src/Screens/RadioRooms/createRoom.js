import React, { useState } from "react";
//import { Image } from 'expo-image';
import { Image, Text, View, TextInput, Button, 
    StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { CheckBox } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation


export const CreateRoom = ()=> {
    
    const [selectedIndex, setIndex] = React.useState(0);

    const [text, onChangeText] = React.useState('');
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
        <View style={styles.container}>
            <View style={styles.title}>
                <Text>Create Room</Text>
            </View>
            <View style={styles.subtitle}>
            <ScrollView>
                <Text>Select a theme</Text>
                <Text style={styles.subtitle}>Room Name</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                    placeholder="Type a room name..."
                />
                <Text style={styles.subtitle}>Room Description</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                    placeholder="Type a room description..."
                />
                <Text style={styles.subtitle}>Settings</Text>
                <Text style={styles.setting}>Allow listeners to queue songs</Text>
                <Stack row align="right" spacing={2}>
                    <CheckBox
                    checked={selectedIndex === 0}
                    onPress={() => setIndex(0)}
                    iconType="material-community"
                    checkedIcon="radiobox-marked"
                    uncheckedIcon="radiobox-blank"
                    />
                </Stack>
                <Text style={styles.setting}>Invites only</Text>
                <Stack row align="right" spacing={2}>
                    <CheckBox
                    checked={selectedIndex === 1}
                    onPress={() => setIndex(1)}
                    iconType="material-community"
                    checkedIcon="radiobox-marked"
                    uncheckedIcon="radiobox-blank"
                    />
                </Stack>
                <View>
                    <TouchableOpacity style={styles.buttonListen} onPress={handleContainerClick}>
                        <Text style={styles.buttonText}>Start Listening</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            </View>
        </View>
       
        
            
    );
}

export const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    container: {
        flex: 1,
        justifyContent: 'start',//'space-between'
        paddingTop: 80,
        marginSide: 20,
    },
    title: {
        fontWeight: 'bold',
        color: 'white',
        paddingLeft: 15,
        fontSize: 20,
        paddingTop: 20,
    },
    subtitle: {
        fontWeight: 'bold',
        color: 'white',
        paddingLeft: 15,
        fontSize: 18,
        paddingTop: 20,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'slategrey',
        borderRadius: 5,
    },
    setting: {
        fontSize: 9,
        color: 'white',

    },
    button: {
        marginTop: 20,
        backgroundColor: '#41BBC4',
        borderRadius: 50,
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    buttonListen: {
        marginTop: 30,
        backgroundColor: '#41BBC4',
        borderRadius: 50,
        width: 300,
        height: 45,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    buttonBack: {
        marginTop: 10,
        backgroundColor: '#13151E',
        borderRadius: 50,
        width: 40,
        height: 40,
        paddingLeft: 0,
    },
    buttonText: {
        color: '#181414',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
    },
    emptyText: {
        fontWeight: 'bold',
        color: '#13151E',
        paddingLeft: 15,
        fontSize: 18,
    },
});
