import { Button } from '@rneui/themed'
import { useAuthStore } from '../../Store/useAuthStore'
import { useQueueStore } from '../../Store/useQueueStore'
import { useSpotifyAuthenticate } from '../../Utilities/SpotifyApi/useSpotifyAuthenticate'
import { useEffect, useState, useRef } from 'react'
import { GetCurrentUserProfile } from '../../Utilities/SpotifyApi/Utils'
import { BoldText } from '../../Commons/UI/styledText'
import { Box } from '@rneui/layout'
import { LinearGradient } from 'expo-linear-gradient'
import { View, Image } from 'react-native'
import { COLORS } from '../../Constants'
import { GetQueue } from '../../Utilities/SpotifyApi/Utils'
import {
  userQueue_getQueue,
  userQueue_updateQueue,
} from '../../Utilities/Firebase/user_queue_functions'

export const Login = () => {
  const changeIsLoggedIn = useAuthStore((state) => state.changeIsLoggedIn)
  const [apiLogin] = useSpotifyAuthenticate()
  const accessToken = useAuthStore((state) => state.accessToken)

  // TODO:
  // - add redirect to Spotify Web
  // - pass userId back to app
  // - update userId state => changeUserId(userId)
  // - update isLoggedIn state => changeIsLoggedIn(true)
  // optional: add 'you're being redirected to spotify' page, 'failed login' page

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <LinearGradient
                colors={['#13151E', '#41BBC4']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                locations={[0.6, 1]}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Image
                    style={{
                        resizeMode: 'contain',
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                    }}
                    source={require('../../../assets/loginIllustration.png')}
                />
                <Box
                    style={{
                        display: 'flex',
                        flex: 1,
                        padding: 'auto',
                        alignItems: 'center',
                        marginTop: 100,
                    }}
                >
                    <BoldText style={{ fontSize: 24, color: 'white' }}>
                        Share & Discover.
                    </BoldText>
                    <BoldText style={{ fontSize: 24, color: 'white' }}>
                        Only on JamStream.
                    </BoldText>
                </Box>
            </LinearGradient>
            <Button
                title='Log in'
                onPress={() => {
                    apiLogin()
                }}
                buttonStyle={{
                    backgroundColor: COLORS.primary,
                    borderRadius: 20,
                    margin: 50,
                    paddingVertical: 10,
                }}
                titleStyle={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: COLORS.dark,
                }}
                containerStyle={{
                    width: '100%',
                    position: 'absolute',
                    bottom: 100,
                    left: 0,
                    shadowColor: '#0ff',
                    shadowOpacity: 0.2,
                    shadowRadius: 10,
                }}
            />
        </View>
    )
}
