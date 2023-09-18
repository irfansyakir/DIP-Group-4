import { AppContainer } from './src/App'
import { useFonts } from 'expo-font'
// Blue, green, red and yellow is the default color for the container element and the container element itself is black because it is

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
