import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import {makeRedirectUri, ResponseType, useAuthRequest} from 'expo-auth-session';
import { Button } from 'react-native';
import {useEffect} from "react";
import * as Linking from "expo-linking";
import {useAuthStore} from "../../Store/useAuthStore";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const clientId = process.env.EXPO_PUBLIC_SPOTIFY_API_CLIENT_ID
const redirectUri = Linking.createURL('/');

//Todo
//Add logout function
//add refresh token function

export default function SpotifyApiAuth(){
    const changeAccessToken = useAuthStore((state) => state.changeAccessToken)

    const [request, response, promptAsync] = useAuthRequest(
        {
            //deactivate this to only get the code so can setup refresh token
            responseType: ResponseType.Token,
            clientId: clientId,
            scopes: ['user-read-email', 'playlist-modify-public'],
            // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
            // this must be set to false
            usePKCE: false,
            redirectUri: makeRedirectUri({
                scheme: 'radioroom'
            }),
            // redirectUri: 'exp://127.0.0.1:8081/--/'
        },
        discovery
    );

    useEffect(() => {
        if (response?.type === 'success') {
            const { access_token } = response.params;
            console.log("access token: ", access_token)
            changeAccessToken(access_token)
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