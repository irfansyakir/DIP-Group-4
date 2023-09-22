// MessageBubble.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageBubble = ({ text }) => {
  return (
    <View style={styles.messageContainer}>
      <View style={styles.messageBubble}>
        <Text> You</Text>
        <Text style={styles.messageText}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'flex-end', // Align messages to the right
    marginBottom: 10,
    marginRight: 10
  },
  messageBubble: {
    backgroundColor: '#41BBC4', // Background color of the message bubble
    padding: 10,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    maxWidth: '80%', // Limit the message width to 80% of the container
  },
  messageText: {
    color: 'black',
    fontSize: 16,
  },
});

export default MessageBubble;
