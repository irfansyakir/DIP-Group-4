# NoSQL model

```javascript
{
  "users": {
    "user_id_1": {
      "username": "nicknameOrAlias",
      "rooms": {
         "roomID1": true,
         "roomID2": true
      },
    },

    "user_id_2": {
      "username": "ghopper",
      "rooms": {
         "roomID1": true
      }
    },
    "user_id_3": { ... }
  },

  
  
  "rooms": {
    "room_id_1": {
      "id": "room_id",
      "room_name": "inconspicuous group (real)",
      "last_message": "ghopper: Relay malfunction found. Cause: moth.",
      "last_message_timestamp": 1459361875666,
      "isPublic": true,
      "dj": ["userID1", "userID2"]
    },
    "room_id_2": { ... },
    "room_id_3": { ... },
  },

  
  
  "messages": {
    "room_id_1": {
      "message_id_1": {
        "username": "nicknameOrAlias",
        "message": "aint no way.",
        "timestamp": 121234557
      },
      "message_id_2": {        
        "username": "ghopper",
        "message": "ghopper: Relay malfunction found. Cause: moth.",
        "timestamp": 131239128
      },
    },
    "room_id_2": { ... },
    "room_id_3": { ... }
  },

  
  
  "current_track":{
    "room_id_1":{
      "track_id": "12s35345ghjfghj98903dtg21409",
      "time_of_last_played": 12746,
      "is_current_track_playing": "true"
    },
    "room_id_2": { ... },
    "room_id_3": { ... }
  },

  
  
  "room_queue":{
    "room_id_1":[
        "track_id_1", 
        "track_id_2", 
        "track_id_3"
    ],
    "room_id_2": { ... },
    "room_id_3": { ... }



  "user_queue":{
    "user_id_1":[
        "track_id_1", 
        "track_id_2", 
        "track_id_3"
    ],
    "user_id_2": { ... },
    "user_id_3": { ... }
  }
}
```
