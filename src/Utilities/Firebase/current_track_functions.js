import { child, get, update } from 'firebase/database'
import { dbRef } from '../../../firebaseConfig'

export async function current_track_updateCurrentTrack({
    roomID,
    trackURL,
    timeOfLastPlayed,
    isCurrentTrackPlaying,
}) {
    if (roomID === null) {
        throw new Error('roomID is missing in current_track_updateCurrentTrack.')
    }
    const updates = {}

    if (trackURL !== undefined) {
        updates[`/current_track/${roomID}/track_url`] = trackURL
    }
    if (timeOfLastPlayed !== undefined) {
        updates[`/current_track/${roomID}/time_of_last_played`] = timeOfLastPlayed
    }
    if (isCurrentTrackPlaying !== undefined) {
        updates[`/current_track/${roomID}/is_current_track_playing`] = isCurrentTrackPlaying
    }
    try {
        await update(dbRef, updates)
        // await console.log("current room track updated successfully")
    } catch (e) {
        console.log(e)
        throw e
    }
}

export async function current_track_getCurrentTrack({ roomID }) {
    if (roomID === null) {
        throw new Error('roomID is missing in current_track_getCurrentTrack.')
    }
    try {
        const snapshot = await get(child(dbRef, `/current_track/${roomID}`))
        return await snapshot.val()
    } catch (e) {
        console.log(e)
        throw e
    }
}
