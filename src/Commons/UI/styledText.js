import { Text } from 'react-native'

export function BoldText(props) {
  return <Text {...props} style={[props.style, { fontFamily: 'InterBold' }]} />
}

export function MediumText(props) {
  return (
    <Text {...props} style={[props.style, { fontFamily: 'InterMedium' }]} />
  )
}

export function LightText(props) {
  return <Text {...props} style={[props.style, { fontFamily: 'InterLight' }]} />
}
