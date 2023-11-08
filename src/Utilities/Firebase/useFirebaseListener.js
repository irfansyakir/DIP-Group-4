import {ref, onValue} from "firebase/database";
import {db, dbRef} from "../../../firebaseConfig"
import {useEffect, useState} from "react";

export function useTimeOfLastPlayedListener(roomID){
  const [timeOfLastPlayed, setTimeOfLastPlayed] = useState(0)

  const timeOfLastPlayedRef = ref(db, `/current_track/${roomID}/time_of_last_played`)

  useEffect(() => {
    onValue(timeOfLastPlayedRef, (snapshot) => {
      const data = snapshot.val();
      setTimeOfLastPlayed(data)
    });
  }, []);

  return [timeOfLastPlayed]
}
export function useIsCurrentTrackPlayingListener(roomID){
  const [isCurrentTrackPlaying, setIsCurrentTrackPlaying] = useState(false)

  const isCurrentTrackPlayingRef = ref(db, `/current_track/${roomID}/is_current_track_playing`)

  useEffect(() => {
    onValue(isCurrentTrackPlayingRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(data)
      setIsCurrentTrackPlaying(data)
    });
  }, []);

  return [isCurrentTrackPlaying]
}

export function useRoomTrackIDListener(roomID){
  const [trackID, setTrackID] = useState()
  const trackIDRef = ref(db, `/current_track/${roomID}/track_id`)

  useEffect(() => {
    onValue(trackIDRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(data)
      setTrackID(data)
    });
  }, []);

  return [trackID]
}

export function useRoomCurrentQueue(roomID){
  const [currentQueue, setCurrentQueue] = useState()
  const currentQueueRef = ref(db, `/queue/${roomID}`)

  useEffect(() => {
    onValue(currentQueueRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(data)
      setCurrentQueue(data)
    });
  }, []);

  return [currentQueue]
}

export function useUserCurrentQueue(userID){
  const [userQueue, setUserQueue] = useState()
  const userQueueRef = ref(db, `/user_queue/${userID}`)

  useEffect(() => {
    onValue(userQueueRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(data)
      setUserQueue(data)
    });
  }, []);

  return [userQueue]
}

export function useMessageListener(roomID){
  const [messages, setMessages] = useState()
  const messagesRef = ref(db, `/messages/${roomID}`)

  useEffect(() => {
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(data)
      setMessages(data)
    });
  }, []);

  return [messages]
}

export function useRoomListener(roomID){
  const [room, setRoom] = useState()
  const roomRef = ref(db, `/rooms/${roomID}`)

  useEffect(() => {
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(data)
      setRoom(data)
    });
  }, []);

  return [room]
}

export function useUserListener(userID){
  const [user, setUser] = useState()
  const userRef = ref(db, `/users/${userID}`)

  useEffect(() => {
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(data)
      setUser(data)
    });
  }, []);

  return [user]
}