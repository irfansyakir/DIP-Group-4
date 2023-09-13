import {StyleSheet, Text, View} from 'react-native';
import { Button } from '@rneui/themed';
export const RadioRooms = ({navigation}) => {
    return (
        <View style={styles.container}>
            
            <Button
                onPress={() => {
                    navigation.navigate('Chatroom')
                }}
            >
                Go to Chatroom
            </Button>
        </View>

    );
}   


const styles = StyleSheet.create({
    container: {
        display: "flex",
        width: '100%',
        height: '100%',

        // backgroundColor: 'pink',
        // alignItems: 'center',
        justifyContent: 'center',
    },
});