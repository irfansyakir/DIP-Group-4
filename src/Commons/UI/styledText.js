import { Text } from 'react-native'

export function BoldText(props) {
  return <Text {...props} style={{ fontFamily: 'InterBold', ...props.style }} />
}

export function MediumText(props) {
  return (
    <Text {...props} style={{ fontFamily: 'InterMedium', ...props.style }} />
  )
}

export function LightText(props) {
  return (
    <Text {...props} style={{ fontFamily: 'InterLight', ...props.style }} />
  )
}
