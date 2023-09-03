import { Button } from '@rneui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '../../Store/useAuthStore'

export const Profile = () => {
  const signOut = useAuthStore((state) => state.signOut)
  const handleLogout = () => {
    signOut()
  }
  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <Button title='Log Out' onPress={handleLogout} />
    </SafeAreaView>
  )
}
