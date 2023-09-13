import * as WebBrowser from 'expo-web-browser';
import {AccessTokenRequest, makeRedirectUri, ResponseType, useAuthRequest} from 'expo-auth-session';
import {useEffect} from "react";
import {useAuthStore} from "../../Store/useAuthStore";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const clientId = process.env.EXPO_PUBLIC_SPOTIFY_API_CLIENT_ID
const clientSecret = process.env.EXPO_PUBLIC_SPOTIFY_API_CLIENT_SECRET

// const redirectUri = Linking.createURL('/');
const redirectUri = makeRedirectUri({
        scheme: 'radioroom',
        path: 'redirect'
})
// The redirect URI ideally would be radioroom://redirect. In expo project would be exp://localhost

const scope = ['user-read-email', 'playlist-modify-public']
//Todo
//Add logout function
//add refresh token function

export function useSpotifyApi(){
    const changeAccessToken = useAuthStore((state) => state.changeAccessToken)
    const changeIsLoggedIn = useAuthStore((state) => state.changeIsLoggedIn)

    // const changeCode = useAuthStore((state) => state.changeCode)
    // const changeCodeVerifier = useAuthStore((state) => state.changeCodeVerifier)
    const changeRefreshToken = useAuthStore((state) => state.changeRefreshToken)

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: clientId,
            // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
            // this must be set to false
            usePKCE: false,
            redirectUri: redirectUri,
        },
        discovery
    );

    useEffect(() => {
        if (response?.type === 'success') {
            // console.log(response)
            const { code } = response.params;
            // console.log("access token: ", access_token)
            // changeAccessToken(access_token)
            // console.log(code)
            const tokenRequest = new AccessTokenRequest({
                code: code,
                redirectUri: redirectUri,
                clientId: clientId,
                clientSecret: clientSecret,
                scopes: scope,
                // AuthorizationCode: "authorization_code"
            },
                discovery
            )
            tokenRequest.performAsync(discovery)
                .then(r => {
                    changeAccessToken(r.accessToken)
                    changeRefreshToken(r.refreshToken)
                    console.log("Access Token: \n", r.accessToken)
                    console.log("Refresh Token: \n", r.refreshToken)
                })

        }
    }, [response]);

    return (
        [promptAsync]
    );
}

//legacy code -----------------------------------------------------------------------------------------------

//     import * as Linking from 'expo-linking';
// // import { Linking } from 'react-native'
//     import * as WebBrowser from 'expo-web-browser';
//
//     const clientId = process.env.EXPO_PUBLIC_SPOTIFY_API_CLIENT_ID
//     const redirectUri = Linking.createURL('/');
//
//     const authUrl = 'https://accounts.spotify.com/authorize?';
//
//
//     async function generateCodeChallenge(codeVerifier) {
//         //Temp static hash
//         return "932f3c1b56257ce8539ac269d7aab42550dacf8818d075f0bdf1990562aae3ef"
//             .replace(/\+/g, '-')
//             .replace(/\//g, '_')
//             .replace(/=+$/, '');
//         // sha256("codeVerifier").then((hash) => {
//         //     console.log(hash);
//         // });
//
//         // return sha256Bytes(generateMessage(codeVerifier)).then(hash => {
//         //     console.log(hash);
//         //     return hash
//         // });
//     }
//
//     function generateRandomString(length) {
//         let text = '';
//         let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//
//         for (let i = 0; i < length; i++) {
//             text += possible.charAt(Math.floor(Math.random() * possible.length));
//         }
//         return text;
//     }
//
//     export const Api = (changeCode, changeCodeVerifier, changeAccessToken, changeRefreshToken) => {
//
//         let codeVerifier = generateRandomString(128);
//         // console.log(codeVerifier)
//         // generateCodeChallenge(codeVerifier)
//         // // console.log(generateCodeChallenge(codeVerifier))
//
//
//
//         generateCodeChallenge(codeVerifier)
//             .then(codeChallenge => {
//                 let state = generateRandomString(16);
//                 let scope = 'streaming user-read-private user-read-email';
//
//                 changeCodeVerifier(codeVerifier)
//
//                 let args = new URLSearchParams({
//                     response_type: 'code',
//                     client_id: clientId,
//                     scope: scope,
//                     redirect_uri: redirectUri,
//                     state: state,
//                     code_challenge_method: 'S256',
//                     code_challenge: codeChallenge
//                 });
//
//                 // window.location = 'https://accounts.spotify.com/authorize?' + args;
//                 WebBrowser.openAuthSessionAsync(authUrl + args)
//                     .then((response) => {
//                         console.log(response)
//                         if(response === 'success'){
//                             const {url, params} = response
//
//                             console.log('Authentication successful');
//                             console.log('Final URL:', url);
//                             console.log('Query Parameters:', params);
//                         }
//                     })
//                     .catch((error) => {
//                         console.error('Error opening web browser:', error);
//                     });
//             });
//     }