// index.js

import React from 'react';
import { View, Text, } from 'react-native';
import { COLORS, SIZES } from '../../../../../../Constants';
import { BoldText } from '../../../../../../Commons/UI/styledText';

const MessageBubble = ({ text, timestamp, right, username}) => {

if (right) {
return (
  // Your messages
  <View style={{ alignItems: 'flex-end', marginBottom:10,}}>
    <View style={{
      backgroundColor: COLORS.primary, // Background color of the message bubble
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius:15,
      borderBottomRightRadius: 0,
      maxWidth: '90%',
    }}>
      <Text style={{ color: COLORS.dark,fontSize: SIZES.sm,}}>{text}</Text>
      <Text style={{ color: COLORS.darkblue, fontSize: SIZES.xSmall, alignSelf:'flex-end'}}>{timestamp}</Text>
    </View>
  </View>
);
}

// Other people's messages
else {
return (
  <View style={{ alignItems: 'flex-start', marginBottom:10,}}>
    <View style={{
      backgroundColor: COLORS.darkbluesat,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius:15,
      borderBottomLeftRadius: 0,
      maxWidth: '90%',
      alignItems:'flex-start'
    }}>
      <Text style={{ color: COLORS.light, fontSize: SIZES.small,}}>{username}</Text>
      <Text style={{ color: COLORS.white,fontSize: SIZES.sm,}}>{text}</Text>
      <Text style={{ color: COLORS.grey, fontSize: SIZES.xSmall, alignSelf:'flex-end'}}>{timestamp}</Text>

    </View>

  </View>
);
}
};

export default MessageBubble;
