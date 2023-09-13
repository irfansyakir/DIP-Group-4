import { AppContainer } from './src/App'
import { useFonts } from 'expo-font'

export default function App() {
  const [loaded] = useFonts({
    InterLight: require('./assets/fonts/Inter-Light.ttf'),
    InterMedium: require('./assets/fonts/Inter-Medium.ttf'),
    InterBold: require('./assets/fonts/Inter-Bold.ttf'),
  })

  if (!loaded) {
    return null
  }

  return <AppContainer />
}
