import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { io } from "socket.io-client";

const SocketContext = createContext()

export const useSocketContext = () => useContext(SocketContext)

const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const { currentUser} = useAuth()


    useEffect(() => {
        if(currentUser)
        {
            const socketInit = io(process.env.REACT_APP_SERVER_URL);
            setSocket(socketInit)

            // Emit addUser when the user is connected
            socketInit.emit('addUser', currentUser.uid);

            // Listen for online users
            socketInit.on('onlineUsers', (users) => {
                setOnlineUsers(users); // Update the list of online users
            });

            return () => {
                socketInit.disconnect(); // Ensure proper disconnection
                setSocket(null); // Reset the socket state
            };
        }
        else
        {
            if (socket) {
                socket.disconnect(); // Properly close the socket if no user
                setSocket(null);
            }
        }
    },[currentUser])

    const context = {
        socket,
        onlineUsers
    }

    return <SocketContext.Provider value={context}>{children}</SocketContext.Provider>
}

export default SocketProvider