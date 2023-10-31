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
    },
    currentPage: '',
    position: 0,
    duration: 0,
    changeCurrentPage: (page) => set(() => ({ currentPage: page })),
    changeSoundObject: (sound) => set(() => ({ soundObject: sound })),
    addToPlaylist: (track) => set(() => ({ playlist: [...playlist, track] })),
    clearPlaylist: () => set(() => ({ playlist: [] })),
    changeIsPlaying: (isPlaying) => set(() => ({ isPlaying: isPlaying })),
    changeSongInfo: (url, title, artist, albumName) =>
        set(() => ({
            songInfo: {
                coverUrl: url,
                songTitle: title,
                songArtist: artist,
                songAlbum: albumName,
            },
        })),
    changePosition: (pos) => set(() => ({ position: pos })),
    changeDuration: (duration) => set(() => ({ duration: duration })),
}))
