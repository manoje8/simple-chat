# Simple Chat Application

This project is a simple chat application built using the MERN (MongoDB, Express, React, Node.js) stack and Socket.io for real-time communication. It includes user authentication, real-time messaging, typing indicators, and a list of online users.

## Features

- **User Authentication**: Secure login and registration with Firebase Authentication.
- **Real-time Messaging**: Instant messaging using Socket.io.
- **Typing Indicators**: See when the other user is typing.
- **Online Users List**: Display the list of users currently online.
- **Responsive UI**: Mobile-friendly design with Bootstrap 4.6.

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
git clone https://github.com/manoje8/simple-chat.git	
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