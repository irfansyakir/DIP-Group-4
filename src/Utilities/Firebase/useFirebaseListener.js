import {ref, onValue} from "firebase/database";
import {db, dbRef} from "../../../firebaseConfig"
import {useEffect, useState} from "react";

export function useFirebaseListener(roomID){
  const [timeOfLastPlayed, setTimeOfLastPlayed] = useState(0)
  const [isCurrentTrackPlaying, setIsCurrentTrackPlaying] = useState(false)

  const timeOfLastPlayedRef = ref(db, `/current_track/${roomID}/time_of_last_played`)
  const isCurrentTrackPlayingRef = ref(db, `/current_track/${roomID}/is_current_track_playing`)

  useEffect(() => {
    onValue(timeOfLastPlayedRef, (snapshot) => {
      const data = snapshot.val();
      setTimeOfLastPlayed(data)
    });
    onValue(isCurrentTrackPlayingRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(data)
      setIsCurrentTrackPlaying(data)
    });
  }, []);

  return [timeOfLastPlayed, isCurrentTrackPlaying]
}