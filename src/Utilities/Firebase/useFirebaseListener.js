import { onValue, ref } from 'firebase/database'
import { db } from '../../../firebaseConfig'
import { useEffect, useState } from 'react'
import { current_track_getCurrentTrack } from './current_track_functions'

export function useRoomTrackURLListener(roomID) {
    const [trackURL, setTrackURL] = useState()
    const trackURLRef = ref(db, `/current_track/${roomID}/track_url`)
    current_track_getCurrentTrack({ roomID: roomID }).then((currentTrack) => {
        console.log('currentTrack', currentTrack.track_url)
        setTrackURL(currentTrack.track_url)
    })

    useEffect(() => {
        return onValue(trackURLRef, (snapshot) => {
            const data = snapshot.val()
            setTrackURL(data)
        })
    }, [])

    return trackURL
}

export function useRoomSongInfoListener(roomID) {
    const [songInfo, setSongInfo] = useState()
    const songInfoRef = ref(db, `/current_track/${roomID}/song_info`)

    useEffect(() => {
        return onValue(songInfoRef, (snapshot) => {
            const data = snapshot.val()
            setSongInfo(data)
        })
    }, [])

    return songInfo
}

export function useUserCurrentQueue(userID) {
    const [userQueue, setUserQueue] = useState()
    const userQueueRef = ref(db, `/user_queue/${userID}`)

    useEffect(() => {
        return onValue(userQueueRef, (snapshot) => {
            const data = snapshot.val()
            // console.log(data)
            setUserQueue(data)
        })
    }, [])

    return [userQueue]
}

export function useMessageListener(roomID) {
    const [messages, setMessages] = useState()
    const messagesRef = ref(db, `/messages/${roomID}`)

    useEffect(() => {
        return onValue(messagesRef, (snapshot) => {
            const data = snapshot.val()
            // console.log(data)
            setMessages(data)
        })
    }, [])

    return [messages]
}

export function useRoomListener(roomID) {
    const [room, setRoom] = useState()
    const roomRef = ref(db, `/rooms/${roomID}`)

    useEffect(() => {
        return onValue(roomRef, (snapshot) => {
            const data = snapshot.val()
            // console.log(data)
            setRoom(data)
        })
    }, [])

    return [room]
}

export function useUserListener(userID) {
    const [user, setUser] = useState()
    const userRef = ref(db, `/users/${userID}`)

    useEffect(() => {
        return onValue(userRef, (snapshot) => {
            const data = snapshot.val()
            // console.log(data)
            setUser(data)
        })
    }, [])

    return [user]
}

export function useTimeOfLastPlayedListener(roomID) {
    const [timeOfLastPlayed, setTimeOfLastPlayed] = useState(0)

    const timeOfLastPlayedRef = ref(db, `/current_track/${roomID}/time_of_last_played`)

    useEffect(() => {
        current_track_getCurrentTrack({ roomID: roomID }).then((currentTrack) => {
            console.log('currentTrack', currentTrack.time_of_last_played)
            setTimeOfLastPlayed(currentTrack.time_of_last_played)
        })
        return onValue(timeOfLastPlayedRef, (snapshot) => {
            const data = snapshot.val()
            setTimeOfLastPlayed(data)
        })
    }, [])

    return timeOfLastPlayed
}
export function useIsCurrentTrackPlayingListener(roomID) {
    const [isCurrentTrackPlaying, setIsCurrentTrackPlaying] = useState(false)

    const isCurrentTrackPlayingRef = ref(db, `/current_track/${roomID}/is_current_track_playing`)

    useEffect(() => {
        return onValue(isCurrentTrackPlayingRef, (snapshot) => {
            const data = snapshot.val()
            // console.log(data)
            setIsCurrentTrackPlaying(data)
        })
    }, [])

    return isCurrentTrackPlaying
}

export function useRoomCurrentQueue(roomID) {
    const [currentQueue, setCurrentQueue] = useState()
    const currentQueueRef = ref(db, `/room_queue/${roomID}`)

    useEffect(() => {
        return onValue(currentQueueRef, (snapshot) => {
            const data = snapshot.val()
            // console.log(data)
            setCurrentQueue(data)
        })
    }, [])

    return currentQueue
}
