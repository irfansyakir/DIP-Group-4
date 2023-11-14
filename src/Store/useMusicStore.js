import { create } from 'zustand'

export const useMusicStore = create((set) => ({
    soundObject: null,
    playlist: [],
    isPlaying: false,
    songInfo: {
        coverUrl: '',
        songTitle: '',
        songArtist: '',
        songAlbum: '',
        songId: '',
    },
    currentPage: '',
    position: 0,
    duration: 0,
    isRepeat: false,
    changeCurrentPage: (page) => set(() => ({ currentPage: page })),
    changeSoundObject: (sound) => set(() => ({ soundObject: sound })),
    addToPlaylist: (track) => set(() => ({ playlist: [...playlist, track] })),
    clearPlaylist: () => set(() => ({ playlist: [] })),
    changeIsPlaying: (isPlaying) => set(() => ({ isPlaying: isPlaying })),
    changeSongInfo: (url, title, artist, albumName, id) =>
        set(() => ({
            songInfo: {
                coverUrl: url,
                songTitle: title,
                songArtist: artist,
                songAlbum: albumName,
                songId: id,
            },
        })),
    changePosition: (pos) => set(() => ({ position: pos })),
    changeDuration: (duration) => set(() => ({ duration: duration })),
    changeIsRepeat: (isRepeat) => set(() => ({ isRepeat: isRepeat })),
}))
