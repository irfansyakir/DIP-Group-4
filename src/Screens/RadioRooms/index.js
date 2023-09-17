import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import Svg, { Text as SvgText } from 'react-native-svg';

export const RadioRooms = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Sample data for recommended radio rooms
  const recommendedRooms = [
    { id: '1', name: 'Radio Room 1' },
    { id: '2', name: 'Radio Room 2' },
    { id: '3', name: 'Radio Room 3' },
  ];

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId === selectedRoom ? null : roomId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Svg width="100%" height="100%">
          <SvgText x="10" y="20" fontSize="25" fill="white" fontWeight="bold">
            RadioRooms
          </SvgText>
        </Svg>
      </View>
      <TouchableOpacity style={styles.buttonContainer}>
        <Svg width="100%" height="100%">
          <SvgText
            x="50%"
            y="27"
            fontSize="17"
            fill="black"
            fontWeight="bold"
            textAnchor="middle"
          >
            Create Room +
          </SvgText>
        </Svg>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => {} /* Handle search bar click */}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Search by room code..."
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          autoFocus={false}
        />
      </TouchableOpacity>
      <Text style={styles.recommendText}>Recommend for you</Text>
      <FlatList
        data={recommendedRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.roomContainer}>
            <TouchableOpacity
              onPress={() => handleRoomSelect(item.id)}
              style={[
                styles.roomBox,
                {
                  backgroundColor: selectedRoom === item.id ? 'gray' : 'black',
                  width: selectedRoom === item.id ? 250 : 200, // Adjust the width as needed
                },
              ]}
            >
              <Text style={styles.roomRecommendation}>{item.name}</Text>
              <TouchableOpacity style={styles.joinButton}>
                <Svg width="100%" height="100%">
                  <SvgText
                    x="50%"
                    y="60%"
                    fontSize="14"
                    fill={selectedRoom === item.id ? 'black' : 'black'}
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    Join Room
                  </SvgText>
                </Svg>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    backgroundColor: '#41BBC4',
    borderRadius: 103.571,
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
  },
  searchBar: {
    position: 'absolute',
    top: 80,
    width: '100%',
    height: 37,
    backgroundColor: '#343434',
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 10,
    paddingLeft: 10,
  },
  recommendText: {
    position: 'absolute',
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 120,
  },
  roomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomBox: {
    backgroundColor: 'black',
    padding: 20,
    flex: 1,
    marginLeft: 20,
    flexDirection: 'row', // Add this to make room for the Join Room button
    justifyContent: 'space-between', // Add this to place the Join Room button on the right
    alignItems: 'center', // Add this to vertically center the Join Room button
  },
  roomRecommendation: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  joinButton: {
    backgroundColor: '#41BBC4',
    borderRadius: 103.571,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100, // Adjust the width as needed
    height: 34,
  },
});
