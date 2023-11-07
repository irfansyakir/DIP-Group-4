import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import Svg, { Text as SvgText } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from '../../Store/useAuthStore'
import { useQueueStore } from '../../Store/useQueueStore'
import { userQueue_updateQueue } from '../../Utilities/Firebase/user_queue_functions'

export const RadioRooms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const navigation = useNavigation(); // Initialize navigation\

  const userId = useAuthStore((state) => state.userId)
  const storeQueue = useQueueStore((state) => state.queue)

  const handleButtonClick = () => {
    // Navigate to "YourNewPage" screen when the container is clicked
    navigation.navigate("CreateRoom");
  };

  // Sample data for recommended radio rooms
  const recommendedRooms = [
    { id: "1", name: "Radio Room 1" },
    { id: "2", name: "Radio Room 2" },
    { id: "3", name: "Radio Room 3" },
  ];

  const tracks = [
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/5vBSrE1xujD2FXYRarbAXc",
            },
            href: "https://api.spotify.com/v1/artists/5vBSrE1xujD2FXYRarbAXc",
            id: "5vBSrE1xujD2FXYRarbAXc",
            name: "Years & Years",
            type: "artist",
            uri: "spotify:artist:5vBSrE1xujD2FXYRarbAXc",
          },
        ],
        available_markets: ["CA", "MX", "US"],
        external_urls: {
          spotify: "https://open.spotify.com/album/09mWpzpUOSjjvK2iNqEIYn",
        },
        href: "https://api.spotify.com/v1/albums/09mWpzpUOSjjvK2iNqEIYn",
        id: "09mWpzpUOSjjvK2iNqEIYn",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab67616d0000b2731b540c6520c468dfc0171a60",
            width: 640,
          },
          {
            height: 300,
            url: "https://i.scdn.co/image/ab67616d00001e021b540c6520c468dfc0171a60",
            width: 300,
          },
          {
            height: 64,
            url: "https://i.scdn.co/image/ab67616d000048511b540c6520c468dfc0171a60",
            width: 64,
          },
        ],
        name: "Communion (Deluxe)",
        release_date: "2015-06-22",
        release_date_precision: "day",
        total_tracks: 18,
        type: "album",
        uri: "spotify:album:09mWpzpUOSjjvK2iNqEIYn",
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/5vBSrE1xujD2FXYRarbAXc",
          },
          href: "https://api.spotify.com/v1/artists/5vBSrE1xujD2FXYRarbAXc",
          id: "5vBSrE1xujD2FXYRarbAXc",
          name: "Years & Years",
          type: "artist",
          uri: "spotify:artist:5vBSrE1xujD2FXYRarbAXc",
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/4NHQUGzhtTLFvgF5SZesLK",
          },
          href: "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK",
          id: "4NHQUGzhtTLFvgF5SZesLK",
          name: "Tove Lo",
          type: "artist",
          uri: "spotify:artist:4NHQUGzhtTLFvgF5SZesLK",
        },
      ],
      available_markets: ["CA", "MX", "US"],
      disc_number: 1,
      duration_ms: 203204,
      explicit: false,
      external_ids: { isrc: "GBUM71600961" },
      external_urls: {
        spotify: "https://open.spotify.com/track/4ZH03VC3uJk7uKk7CwsBqH",
      },
      href: "https://api.spotify.com/v1/tracks/4ZH03VC3uJk7uKk7CwsBqH",
      id: "4ZH03VC3uJk7uKk7CwsBqH",
      is_local: false,
      name: "Desire",
      popularity: 52,
      preview_url: null,
      track_number: 18,
      type: "track",
      uri: "spotify:track:4ZH03VC3uJk7uKk7CwsBqH",
    },
    {
      album: {
        album_type: "SINGLE",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/1ZUpQr4VSnnP86WbaRRMpd",
            },
            href: "https://api.spotify.com/v1/artists/1ZUpQr4VSnnP86WbaRRMpd",
            id: "1ZUpQr4VSnnP86WbaRRMpd",
            name: "Jay Pryor",
            type: "artist",
            uri: "spotify:artist:1ZUpQr4VSnnP86WbaRRMpd",
          },
        ],
        available_markets: [],
        external_urls: {
          spotify: "https://open.spotify.com/album/7JTUNTKBI02GVezHsE43lz",
        },
        href: "https://api.spotify.com/v1/albums/7JTUNTKBI02GVezHsE43lz",
        id: "7JTUNTKBI02GVezHsE43lz",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab67616d0000b27341e2c4df53f9c1af0c6be47f",
            width: 640,
          },
          {
            height: 300,
            url: "https://i.scdn.co/image/ab67616d00001e0241e2c4df53f9c1af0c6be47f",
            width: 300,
          },
          {
            height: 64,
            url: "https://i.scdn.co/image/ab67616d0000485141e2c4df53f9c1af0c6be47f",
            width: 64,
          },
        ],
        name: "Aside",
        release_date: "2020-08-14",
        release_date_precision: "day",
        total_tracks: 1,
        type: "album",
        uri: "spotify:album:7JTUNTKBI02GVezHsE43lz",
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/1ZUpQr4VSnnP86WbaRRMpd",
          },
          href: "https://api.spotify.com/v1/artists/1ZUpQr4VSnnP86WbaRRMpd",
          id: "1ZUpQr4VSnnP86WbaRRMpd",
          name: "Jay Pryor",
          type: "artist",
          uri: "spotify:artist:1ZUpQr4VSnnP86WbaRRMpd",
        },
      ],
      available_markets: [],
      disc_number: 1,
      duration_ms: 186879,
      explicit: true,
      external_ids: { isrc: "GBUM72002254" },
      external_urls: {
        spotify: "https://open.spotify.com/track/5J7A8bZU1GaZpbZrAkAq4r",
      },
      href: "https://api.spotify.com/v1/tracks/5J7A8bZU1GaZpbZrAkAq4r",
      id: "5J7A8bZU1GaZpbZrAkAq4r",
      is_local: false,
      name: "Aside",
      popularity: 41,
      preview_url: null,
      track_number: 1,
      type: "track",
      uri: "spotify:track:5J7A8bZU1GaZpbZrAkAq4r",
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/69GGBxA162lTqCwzJG5jLp",
            },
            href: "https://api.spotify.com/v1/artists/69GGBxA162lTqCwzJG5jLp",
            id: "69GGBxA162lTqCwzJG5jLp",
            name: "The Chainsmokers",
            type: "artist",
            uri: "spotify:artist:69GGBxA162lTqCwzJG5jLp",
          },
        ],
        available_markets: [],
        external_urls: {
          spotify: "https://open.spotify.com/album/4JPguzRps3kuWDD5GS6oXr",
        },
        href: "https://api.spotify.com/v1/albums/4JPguzRps3kuWDD5GS6oXr",
        id: "4JPguzRps3kuWDD5GS6oXr",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab67616d0000b2730c13d3d5a503c84fcc60ae94",
            width: 640,
          },
          {
            height: 300,
            url: "https://i.scdn.co/image/ab67616d00001e020c13d3d5a503c84fcc60ae94",
            width: 300,
          },
          {
            height: 64,
            url: "https://i.scdn.co/image/ab67616d000048510c13d3d5a503c84fcc60ae94",
            width: 64,
          },
        ],
        name: "Memories...Do Not Open",
        release_date: "2017-04-07",
        release_date_precision: "day",
        total_tracks: 12,
        type: "album",
        uri: "spotify:album:4JPguzRps3kuWDD5GS6oXr",
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/69GGBxA162lTqCwzJG5jLp",
          },
          href: "https://api.spotify.com/v1/artists/69GGBxA162lTqCwzJG5jLp",
          id: "69GGBxA162lTqCwzJG5jLp",
          name: "The Chainsmokers",
          type: "artist",
          uri: "spotify:artist:69GGBxA162lTqCwzJG5jLp",
        },
      ],
      available_markets: [],
      disc_number: 1,
      duration_ms: 221506,
      explicit: false,
      external_ids: { isrc: "USQX91603031" },
      external_urls: {
        spotify: "https://open.spotify.com/track/72jbDTw1piOOj770jWNeaG",
      },
      href: "https://api.spotify.com/v1/tracks/72jbDTw1piOOj770jWNeaG",
      id: "72jbDTw1piOOj770jWNeaG",
      is_local: false,
      name: "Paris",
      popularity: 77,
      preview_url:
        "https://p.scdn.co/mp3-preview/2b043ab3ea679d2e91c5bd827cbf24ef7a2b1b44?cid=0762bb3ca2c548088f388227217e5cd5",
      track_number: 8,
      type: "track",
      uri: "spotify:track:72jbDTw1piOOj770jWNeaG",
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/14Tg9FvbNismPR1PJHxRau",
            },
            href: "https://api.spotify.com/v1/artists/14Tg9FvbNismPR1PJHxRau",
            id: "14Tg9FvbNismPR1PJHxRau",
            name: "Sultan + Shepard",
            type: "artist",
            uri: "spotify:artist:14Tg9FvbNismPR1PJHxRau",
          },
        ],
        available_markets: [],
        external_urls: {
          spotify: "https://open.spotify.com/album/3XARakl3JkVizUCWSFG0wY",
        },
        href: "https://api.spotify.com/v1/albums/3XARakl3JkVizUCWSFG0wY",
        id: "3XARakl3JkVizUCWSFG0wY",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab67616d0000b273c2d680d3ca07020db799d627",
            width: 640,
          },
          {
            height: 300,
            url: "https://i.scdn.co/image/ab67616d00001e02c2d680d3ca07020db799d627",
            width: 300,
          },
          {
            height: 64,
            url: "https://i.scdn.co/image/ab67616d00004851c2d680d3ca07020db799d627",
            width: 64,
          },
        ],
        name: "Echoes Of Life: Night",
        release_date: "2019-11-08",
        release_date_precision: "day",
        total_tracks: 9,
        type: "album",
        uri: "spotify:album:3XARakl3JkVizUCWSFG0wY",
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/14Tg9FvbNismPR1PJHxRau",
          },
          href: "https://api.spotify.com/v1/artists/14Tg9FvbNismPR1PJHxRau",
          id: "14Tg9FvbNismPR1PJHxRau",
          name: "Sultan + Shepard",
          type: "artist",
          uri: "spotify:artist:14Tg9FvbNismPR1PJHxRau",
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/4gmndqcVVyxmzgOunTiuAD",
          },
          href: "https://api.spotify.com/v1/artists/4gmndqcVVyxmzgOunTiuAD",
          id: "4gmndqcVVyxmzgOunTiuAD",
          name: "Mougleta",
          type: "artist",
          uri: "spotify:artist:4gmndqcVVyxmzgOunTiuAD",
        },
      ],
      available_markets: [],
      disc_number: 1,
      duration_ms: 214000,
      explicit: false,
      external_ids: { isrc: "NLF711905841" },
      external_urls: {
        spotify: "https://open.spotify.com/track/3V2kSz3hhf3XmY3qkwh8sT",
      },
      href: "https://api.spotify.com/v1/tracks/3V2kSz3hhf3XmY3qkwh8sT",
      id: "3V2kSz3hhf3XmY3qkwh8sT",
      is_local: false,
      name: "All Of Your Weapons",
      popularity: 36,
      preview_url:
        "https://p.scdn.co/mp3-preview/337adebbc2c56682227fdffb0b1ac721f6cc356d?cid=0762bb3ca2c548088f388227217e5cd5",
      track_number: 3,
      type: "track",
      uri: "spotify:track:3V2kSz3hhf3XmY3qkwh8sT",
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/68abRTdO4meYReMWHvBYb0",
            },
            href: "https://api.spotify.com/v1/artists/68abRTdO4meYReMWHvBYb0",
            id: "68abRTdO4meYReMWHvBYb0",
            name: "Chris Lane",
            type: "artist",
            uri: "spotify:artist:68abRTdO4meYReMWHvBYb0",
          },
        ],
        available_markets: [],
        external_urls: {
          spotify: "https://open.spotify.com/album/3pexiiVplId7AewXfRylgu",
        },
        href: "https://api.spotify.com/v1/albums/3pexiiVplId7AewXfRylgu",
        id: "3pexiiVplId7AewXfRylgu",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab67616d0000b273b2525c8d0d196069018814b5",
            width: 640,
          },
          {
            height: 300,
            url: "https://i.scdn.co/image/ab67616d00001e02b2525c8d0d196069018814b5",
            width: 300,
          },
          {
            height: 64,
            url: "https://i.scdn.co/image/ab67616d00004851b2525c8d0d196069018814b5",
            width: 64,
          },
        ],
        name: "Laps Around The Sun",
        release_date: "2018-07-13",
        release_date_precision: "day",
        total_tracks: 14,
        type: "album",
        uri: "spotify:album:3pexiiVplId7AewXfRylgu",
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/68abRTdO4meYReMWHvBYb0",
          },
          href: "https://api.spotify.com/v1/artists/68abRTdO4meYReMWHvBYb0",
          id: "68abRTdO4meYReMWHvBYb0",
          name: "Chris Lane",
          type: "artist",
          uri: "spotify:artist:68abRTdO4meYReMWHvBYb0",
        },
      ],
      available_markets: [],
      disc_number: 1,
      duration_ms: 162160,
      explicit: false,
      external_ids: { isrc: "QZ22S1800014" },
      external_urls: {
        spotify: "https://open.spotify.com/track/1czkGv8uzFAqZXAucbmLkv",
      },
      href: "https://api.spotify.com/v1/tracks/1czkGv8uzFAqZXAucbmLkv",
      id: "1czkGv8uzFAqZXAucbmLkv",
      is_local: false,
      name: "Fishin'",
      popularity: 0,
      preview_url: null,
      track_number: 2,
      type: "track",
      uri: "spotify:track:1czkGv8uzFAqZXAucbmLkv",
    },
  ];

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId === selectedRoom ? null : roomId);
  };

  const goToChatroom = () => {
    navigation.navigate('Chatroom', {
      roomID: '123birds',
    })

    // Save personal queue in queueStore to firebase whenever creating/ joining a room
    userQueue_updateQueue({
      userID: userId,
      userQueueList: storeQueue,
    })
    
    // console.log("Clicked!")
  }

  const renderItem = ({ item }) => (
    <View style={styles.trackContainer}>
      <View style={styles.albumCoverContainer}>
        <Image
          source={{ uri: item.album.images[0].url }}
          style={styles.albumCover}
        />
      </View>
      <View style={styles.trackInfoContainer}>
        <Text style={styles.trackTitle}>{item.album.name}</Text>
        <Text style={styles.trackSubtitle}>
          CREATED BY {item.artists[0].name}
        </Text>
        <Text style={styles.trackSubtitleListening}>
          {item.popularity} LISTENING
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.textContainer}>
        <Svg width="100%" height="100%">
          <SvgText x="10" y="20" fontSize="25" fill="white">
            RadioRooms
          </SvgText>
        </Svg>
      </View>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleButtonClick}
      >
        <Svg width="100%" height="100%">
          <SvgText
            x="50%"
            y="27"
            fontSize="17"
            fill="black"
            // fontWeight="bold"
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
      <View style={styles.highlight}>
        <View style={styles.trackContainer}>
          <View style={styles.albumCoverContainer}>
            <Image
              source={{ uri: tracks[0].album.images[0].url }}
              style={styles.albumHighlightCover}
            />
          </View>
          <View style={styles.trackInfoContainer}>
            <Text style={styles.trackTitle}>{tracks[0].album.name}</Text>
            <Text style={styles.trackSubtitle}>
              CREATED BY {tracks[0].artists[0].name}
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="play" size={24} color="yellow" />
              <Text style={styles.trackSubtitleListening}>
                {tracks[0].popularity} LISTENING
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.trackView}>
        <FlatList
          data={tracks.slice(1, tracks.length)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>

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
                  backgroundColor: selectedRoom === item.id ? "gray" : "black",
                  width: selectedRoom === item.id ? 250 : 200, // Adjust the width as needed
                },
              ]}
            >
              <Text style={styles.roomRecommendation}>{item.name}</Text>
              <TouchableOpacity
                style={styles.joinButton}
                onPress={goToChatroom}
              >
                <Svg width="100%" height="100%">
                  <SvgText
                    x="50%"
                    y="60%"
                    fontSize="14"
                    fill={selectedRoom === item.id ? "black" : "black"}
                    // fontWeight="bold"
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 42,
    backgroundColor: "#41BBC4",
    borderRadius: 103.571,
    // position: "absolute",
    top: 30,
    left: 0,
    right: 0,
  },
  searchBar: {
    //position: "absolute",
    top: 80,
    width: "100%",
    height: 37,
    backgroundColor: "#343434",
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 10,
    paddingLeft: 10,
  },
  recommendText: {
    // position: "absolute",
    fontSize: 17,
    color: "white",
    // fontWeight: "bold",
    marginLeft: 10,
    marginTop: 120,
  },
  roomContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  roomBox: {
    backgroundColor: "black",
    padding: 20,
    flex: 1,
    marginLeft: 20,
    flexDirection: "row", // Add this to make room for the Join Room button
    justifyContent: "space-between", // Add this to place the Join Room button on the right
    alignItems: "center", // Add this to vertically center the Join Room button
  },
  roomRecommendation: {
    flex: 1,
    fontSize: 16,
    color: "white",
    // fontWeight: "bold",
  },
  joinButton: {
    backgroundColor: "#41BBC4",
    borderRadius: 103.571,
    justifyContent: "center",
    alignItems: "center",
    width: 100, // Adjust the width as needed
    height: 34,
  },
  trackContainer: {
    flexDirection: "row",
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  albumCoverContainer: {
    marginRight: 10,
  },
  albumCover: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  trackInfoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  trackTitle: {
    fontSize: 16,
    // fontWeight: "bold",
    color: "white",
  },
  trackSubtitle: {
    fontSize: 14,
    color: "gray",
  },
  trackSubtitleListening: {
    fontSize: 14,
    color: "yellow",
  },
  trackView: {
    paddingTop: 12,
  },
  highlight: {
    backgroundColor: "#343434",
    borderRadius: 20,
    marginTop: 16,
    padding: 12,
  },
  albumHighlightCover: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
});
