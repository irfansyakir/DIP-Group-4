import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@rneui/themed';

export const Chatroom = () => {
  return (
    <View style={styles.container}>
      <Text>dd</Text>
      <Button
        onPress={() => {
          alert('Chatroom');
        }}
      >
        Leave Room
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'pink', // Set the background color to pink
    flex: 1, // Make the container take up the entire available space
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Chatroom;
