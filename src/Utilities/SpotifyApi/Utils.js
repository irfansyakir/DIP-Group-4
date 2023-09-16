
// Resource: https://developer.spotify.com/documentation/web-api/reference
// Feel free to add your own functions. Just pass in the accessToken as a parameter to avoid error handling in here
// Recommended to minimize the use of these as Spotify API can be quite slow, so fetch from top level and pass it down as variables

// Due to premium limitations, the songs will only be available as 30-second previews obtained through the 'preview_url'

export async function GetCurrentUserProfile ({accessToken}){
    return await fetch(`https://api.spotify.com/v1/me`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
        .then(response => {
            response = response.json()
            return response
        })
        .catch((error) => {
            console.error(JSON.stringify(error));
            return null
        })
}
export async function GetUserPlaylists ({accessToken, userId, limit = 20, offset = 0}){
    let url = `https://api.spotify.com/v1/users/${userId}/playlists`
    const extraParams = new URLSearchParams({limit: limit, offset: offset} )
    url = url + '?' + extraParams
    console.log(url.toString())
    return await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
        .then(response => {
            response = response.json()
            return response
        })
        .catch((error) => {
            console.error(JSON.stringify(error));
            return null
        })
}

export async function GetTrack({accessToken, trackId}){
    return await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
        .then(response => {
            response = response.json()
            return response
        })
        .catch((error) => {
            console.error(JSON.stringify(error));
            return null
        })
}