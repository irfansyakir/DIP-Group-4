// MessageBubble.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageBubble = ({ text, timestamp, right}) => {

  return (
    
    <View style={right ? styles.messageContainerRight : styles.messageContainerLeft}>
      <View style={styles.messageBubble}>
        <Text style={styles.youText}>You</Text>
        <Text style={styles.messageText}>{text}</Text>
        <Text style={styles.timestampText}>{timestamp}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainerRight: {
    alignItems: 'flex-end', // Align messages to the right
    marginBottom: 10,
    marginRight: 10
  },

  messageContainerLeft: {
    alignItems: 'flex-start', // Align messages to the right
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

  youText: {
    color: '#13151E',
    fontSize: 10,
    marginLeft: 5
  },
  messageText: {
    color: '#13151E',
    fontSize: 10,
    marginLeft: 5
  },
  timestampText: {
    color: '#F8F8FA',
    fontSize: 7,
    marginLeft: 5
  },
});

export default MessageBubble;
