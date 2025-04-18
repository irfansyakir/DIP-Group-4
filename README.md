# JamStream (RadioRoom)

![JamStream Logo](./assets/icon.png)

## Overview

JamStream is a music streaming mobile application that enhances the music listening experience by adding robust social features. The app combines high-quality music streaming capabilities with interactive social elements that allow users to connect over shared musical interests.

## Features

- **Genre-specific Music Chatrooms**: Discover new music through themed discussion rooms
- **Collaborative Playlists**: Create and edit playlists with friends in real-time
- **Live "Listening Parties"**: Listen to the same music in sync with other users
- **Profile Customization**: Showcase your music taste highlights and preferences
- **Friend Recommendation System**: Connect with users based on musical compatibility
- **Spotify Integration**: Seamless integration with Spotify's extensive music library

## Technologies

- **Frontend**: React Native, Expo
- **Backend**: Firebase Realtime Database
- **Authentication**: Firebase Authentication
- **Music API**: Spotify API
- **State Management**: Zustand
- **UI Components**: React Navigation, React Native Elements

## Prerequisites

- Node.js 14.x or newer
- Expo CLI
- Firebase account
- Spotify Developer API credentials

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/irfansyakir/DIP-Group-4.git
   cd DIP-Group-4
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Setup:
   - Create a `.env` file in the root directory with the following variables:
   ```
   EXPO_PUBLIC_SPOTIFY_API_CLIENT_ID='your_spotify_client_id'
   EXPO_PUBLIC_SPOTIFY_API_CLIENT_SECRET='your_spotify_client_secret'
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Firebase Configuration

The application uses Firebase for backend services. To configure your own Firebase instance:

1. Create a project in Firebase Console
2. Enable Authentication and Realtime Database
3. Update the `firebaseConfig.js` file with your Firebase credentials

## Usage

- Start the application using Expo:
  ```bash
  expo start --port 8081
  ```
- Connect with your Expo Go app on your mobile device or use an emulator

## Challenges and Solutions

### Challenges:
- Integrating Spotify's API with custom social features while maintaining a seamless user experience
- Ensuring real-time chat and collaborative features worked smoothly

### Solutions:
- Used Firebase Realtime Database for handling all social interactions
- Created a custom wrapper around Spotify's Web Playback SDK that integrated with our social features

## Project Structure

```
DIP-Group-4/
├── assets/              # Images, fonts, and other static assets
├── src/                 # Source code
│   ├── components/      # Reusable UI components
│   ├── screens/         # Application screens
│   ├── navigation/      # Navigation configuration
│   ├── services/        # API and service integrations
│   ├── utils/           # Utility functions
│   ├── hooks/           # Custom React hooks
│   ├── store/           # State management (Zustand)
│   └── App.js           # Main application component
├── firebaseConfig.js    # Firebase configuration
├── app.json             # Expo configuration
└── package.json         # Project dependencies
```

## Contributors

- [List of contributors]

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Spotify API for providing music streaming capabilities
- Firebase for backend services
