// MessageBubble.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageBubble = ({ text, timestamp, right, username}) => {
 

  if (right) {
    return (
        <View style={stylesRight.messageContainer}>
          <View style={stylesRight.messageBubble}>
            <Text style={stylesRight.youText}>You</Text>
            <Text style={stylesRight.messageText}>{text}</Text>
            <Text style={stylesRight.timestampText}>{timestamp}</Text>
          </View>
        </View>
    );
  }

  else {
    return (
      <View style={stylesLeft.messageContainer}>
        <View style={stylesLeft.messageBubble}>
          <Text style={stylesLeft.usernameText}>{username}</Text>
          <Text style={stylesLeft.messageText}>{text}</Text>
          <Text style={stylesLeft.timestampText}>{timestamp}</Text>
        </View>
      </View>
  );
  }
};

const stylesRight = StyleSheet.create({
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

  youText: {
    color: '#13151E',
    fontSize: 15,
    marginLeft: 5
  },
  messageText: {
    color: '#13151E',
    fontSize: 15,
    marginLeft: 5
  },
  timestampText: {
    color: '#F8F8FA',
    fontSize: 10,
    marginLeft: 5
  },
});

const stylesLeft = StyleSheet.create({
  messageContainer: {
    alignItems: 'flex-start', // Align messages to the right
    marginBottom: 10,
    marginLeft: 10
  },

  messageContainerLeft: {
    alignItems: 'flex-start', // Align messages to the right
    marginBottom: 10,
    marginRight: 10
  },

  messageBubble: {
    backgroundColor: '#1F3142', // Background color of the message bubble
    padding: 10,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 0,
    maxWidth: '80%', // Limit the message width to 80% of the container
  },

  usernameText: {
    color: '#EEEEEE',
    fontSize: 15,
    marginLeft: 5
  },
  messageText: {
    color: '#EEEEEE',
    fontSize: 15,
    marginLeft: 5
  },
  timestampText: {
    color: '#F8F8FA',
    fontSize: 10,
    marginLeft: 5
  },
});


export default MessageBubble;
