import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as React from 'react'
import { COLORS } from '../../Constants'
import { MediumText } from '../../Commons/UI/styledText'
import { useAuthStore } from '../../Store/useAuthStore'

export const Home = () => {
  const insets = useSafeAreaInsets()
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
      <MediumText style={{ color: COLORS.primary }}>Home Screen</MediumText>
    </View>
  )
}
