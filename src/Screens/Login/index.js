import {StyleSheet, Text, View} from 'react-native';
import { Button } from '@rneui/themed';

export const Login = ({navigation}) => {
    return (
        <View
            style={styles.container}
        >
            <Button
                onPress={() => {
                    navigation.navigate('RootHome')
                }}
            >
                Go to Home
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