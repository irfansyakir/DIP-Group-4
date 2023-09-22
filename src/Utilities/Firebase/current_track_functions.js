import {child, get, update} from "firebase/database";
import {dbRef} from "../../../firebaseConfig";

export async function current_track_updateCurrentTrack({roomID, trackId, timeOfLastPlayed, isCurrentTrackPlaying}){
  const updates = {};

  if(trackId){
    updates[`/current_track/${roomID}/track_id`] = trackId
  }
  if(timeOfLastPlayed){
    updates[`/current_track/${roomID}/time_of_last_played`] = timeOfLastPlayed
  } else{
    updates[`/current_track/${roomID}/time_of_last_played`] = 0
  }
  if(isCurrentTrackPlaying){
    updates[`/current_track/${roomID}/is_current_track_playing`] = isCurrentTrackPlaying
  } else {
    updates[`/current_track/${roomID}/is_current_track_playing`] = false
  }

  try {
    await update(dbRef, updates)
    // await console.log("current room track updated successfully")
  }catch (e) {
    console.log(e)
    throw e
  }
}

export async function current_track_getCurrentTrack({roomID}){
  try {
    const snapshot = await get(child(dbRef, `/current_track/${roomID}`));
    return await snapshot.val()
  }catch (e) {
    console.log(e)
    throw e
  }
}