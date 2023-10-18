// Resource: https://developer.spotify.com/documentation/web-api/reference
// Feel free to add your own functions. Just pass in the accessToken as a parameter to avoid error handling in here
// Recommended to minimize the use of these as Spotify API can be quite slow, so fetch from top level and pass it down as variables

// Due to premium limitations, the songs will only be available as 30-second previews obtained through the 'preview_url'

import { useAuthStore } from '../../Store/useAuthStore'
import { useState } from 'react'

async function handleApiResponse(callback) {
  const zustandRefreshToken = useAuthStore((state) => state.refreshToken)
  const zustandAccessToken = useAuthStore((state) => state.accessToken)
  // const [refreshToken, setRefreshToken] = useState()
  // const [accessToken, setAccessToken] = useState()
}

export async function GetCurrentUserProfile({ accessToken }) {
  try {
    const profileResponse = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    if (profileResponse.status === 200) {
      const profileData = await profileResponse.json()
      return profileData
    } else {
      console.error('Error fetching user profile:', profileResponse.statusText)
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
  }
}

export async function GetUserPlaylists({
  accessToken,
  limit = 20,
  offset = 0,
}) {
  try {
    let url = `https://api.spotify.com/v1/me/playlists`
    const extraParams = new URLSearchParams({ limit: limit, offset: offset })
    url = url + '?' + extraParams
    const playlistResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    if (playlistResponse.status === 200) {
      const playlistData = await playlistResponse.json()
      return playlistData
    } else {
      console.error(
        'Error fetching playlist data:',
        playlistResponse.statusText
      )
    }
  } catch (error) {
    console.error('Error fetching playlist data:', error)
  }
}

export async function GetPlaylistDetails({
  accessToken,
  playlistId,
  limit = 20,
  offset = 0,
}) {
  try {
    let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`
    const extraParams = new URLSearchParams({ limit: limit, offset: offset })
    url = url + '?' + extraParams
    const playlistResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    // console.log(playlistResponse)

    if (playlistResponse.status === 200) {
      const playlistData = await playlistResponse.json()
      return playlistData
    } else {
      console.error(
        'Error fetching playlist data:',
        playlistResponse.statusText
      )
    }
  } catch (error) {
    console.error('Error fetching playlist data:', error)
  }
}

export async function GetTrack({ accessToken, trackId }) {
  return await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      response = response.json()
      return response
    })
    .catch((error) => {
      console.error(JSON.stringify(error))
      return null
    })
}

export async function GetRecentlyPlayed({ accessToken }) {
  try {
    let url = `https://api.spotify.com/v1/me/player/recently-played?limit=7`
    const dataResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    if (dataResponse.status === 200) {
      const data = await dataResponse.json()
      return data
    } else {
      console.error('Error fetching recently played:', dataResponse.statusText)
    }
  } catch (error) {
    console.error('Error fetching recently played data:', error)
  }
}

export async function SearchTrack({ accessToken, text }) {
  return await fetch(
    `https://api.spotify.com/v1/search?q=${text}&type=track&limit=10`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
    .then((response) => {
      response = response.json()
      return response
    })
    .catch((error) => {
      console.error(JSON.stringify(error))
      return null
    })
}

export async function GetQueue({ accessToken }) {
  try {
    let url = `https://api.spotify.com/v1/me/player/queue`
    const dataResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    

    if (dataResponse.status === 200) {
      const data = await dataResponse.json()
      return data
    } else {
      console.error('Error fetching queue:', dataResponse.statusText)
    }
  } catch (error) {
    console.error('Error fetching queue data:', error)
  }
}
