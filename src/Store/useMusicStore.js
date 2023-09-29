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
}))
