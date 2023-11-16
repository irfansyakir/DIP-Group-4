import { useMusicStore } from '../../Store/useMusicStore'
import { useAuthStore } from '../../Store/useAuthStore'
import { Audio } from 'expo-av'
import { GetTrack } from '../../Utilities/SpotifyApi/Utils'
import { useEffect } from 'react'

export function createNewSoundObject(id) {
    const accessToken = useAuthStore((state) => state.accessToken)
    const soundObject = useMusicStore((state) => state.soundObject)
    const changeSoundObject = useMusicStore((state) => state.changeSoundObject)
    const changeIsPlaying = useMusicStore((state) => state.changeIsPlaying)
    const changeSongInfo = useMusicStore((state) => state.changeSongInfo)

    const createSoundObject = async (uri) => {
        // clear previous song
        if (soundObject) {
            changeIsPlaying(false)
            soundObject.unloadAsync()
        }

        const { sound } = await Audio.Sound.createAsync({ uri: uri })
        changeSoundObject(sound)
        changeIsPlaying(true)
    }

    const getTrackData = async () => {
        try {
            const trackData = await GetTrack({
                accessToken: accessToken,
                trackId: id,
            })
            changeSongInfo(
                trackData.album.images[0].url,
                trackData.name,
                trackData.artists[0].name,
                trackData.album.name,
                trackData.id
            )
            createSoundObject(trackData.preview_url)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getTrackData()
    }, [])
    return null
}
