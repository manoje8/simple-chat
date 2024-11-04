# Simple Chat Application

This project is a full-stack chat application built using the MERN (MongoDB, Express, React, Node.js) stack and Socket.io for real-time communication. It includes user authentication, real-time messaging, typing indicators, and a list of online users.

## Features

- **User Authentication**: Secure login and registration with Firebase Authentication.
- **Real-time Messaging**: Instant messaging using Socket.io.
- **Typing Indicators**: See when the other user is typing.
- **Online Users List**: Display the list of users currently online.

### Technologies Used

- **React.js**: JavaScript library for building user interfaces.
- **Socket.io-client**: Client-side library for real-time communication with the server.
- **Bootstrap 4.6**: Responsive CSS framework for designing the UI.
- **Firebase Authentication**: Secure user authentication and management.

## Prerequisites 

- **Node.js** (v14+) 
- **Firebase Project** (for Authentication)

### Installation

1. Clone the repository and navigate to the `client` folder:

```
git clone https://github.com/manoje8/simple-chat
cd simple-chat
```

2. Install the dependencies:

```
npm install
```

 3. Set up Firebase:
- Go to Firebase Console, create a project, and enable Firebase Authentication.
- Add your Firebase config to a `.env` file in the frontend project directory.
- 
```
REACT_APP_FIREBASE_API_KEY=your-api-key 
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id`
```

4. Start the development server:

```
npm start
```
  
The frontend will be available at `http://localhost:3000`.

### User Workflow

- **Sign Up / Log In**: Use Firebase Authentication to register or log in.
- **Select a User**: Choose from the list of online users to start chatting.
- **Send Messages**: Send real-time messages and see the responses instantly.
- **Typing Indicator**: See when the other user is typing.
- **Online Users List**: Display the list of users currently online.

## Changelog

### v0.0.3

- Added context menu for message actions.
- .Added message status

### v0.0.2

- Added main menu for easier navigation.
- Grouped messages by date using `dateParser`.
- Introduced a loader for smoother transitions.

### v0.0.1

- Enabled contact search.
- Added light/dark theme toggle.
- Implemented `timeParser` for message timestamps.