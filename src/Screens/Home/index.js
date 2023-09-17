import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as React from 'react'
import { COLORS } from '../../Constants'
import { MediumText } from '../../Commons/UI/styledText'
import {Button} from "@rneui/themed";
import {useNavigation} from "@react-navigation/native";

export const Home = () => {
  const insets = useSafeAreaInsets()
    const navigation = useNavigation(); // Initialize navigation
  return (
    <View
      style={{
        paddingTop: insets.top, // Add top inset as padding
        paddingBottom: insets.bottom, // Add bottom inset as padding
        flex: 1, // Make sure the content fills the available space
        backgroundColor: COLORS.dark, // Adjust background color as needed
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
        <Button onPress={() => {navigation.navigate('Queue')}}>
            Go to Queue
        </Button>
      <MediumText style={{ color: COLORS.primary }}>Home Screen</MediumText>
    </View>
  )
}
