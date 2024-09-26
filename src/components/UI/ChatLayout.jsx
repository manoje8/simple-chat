import { useCallback, useEffect, useRef, useState } from "react"
import { getMessages, sendMessage } from "../../service/service"
import { useAuth } from "../../context/AuthContext"
import { useSocketContext } from "../../context/SocketContext"

const ChatLayout = () => {
    const { messageReciever, currentUser} = useAuth()
    const { onlineUsers, socket } = useSocketContext()
    const [conversation, setConversation] = useState([])
    const [message, setMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const lastMessage = useRef(null)

    const isOnline = onlineUsers.includes(messageReciever?.uid)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try 
        {
            await sendMessage(message, messageReciever.uid)
            await fetchData()
        } 
        catch (error) 
        {
            console.log("Error", error);
            
        }
        setMessage('')
    }

    const fetchData = useCallback(async() => {
        const data = await getMessages(messageReciever?.uid)
        const messages = Array.isArray(data.message) ? data.message : [];

        setConversation(messages)
        
    },[messageReciever])

    useEffect(() => {
        fetchData()
    },[fetchData])
    
    useEffect(() => {
        if (lastMessage.current) {
            lastMessage.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversation]);

    useEffect(() => {
        if (socket) {
          socket.on("typing", (currentUser) => {
            if (currentUser === messageReciever?.uid) {
                setTypingUser(currentUser);
              }
          });
    
          socket.on("stopTyping", (currentUser) => {
            if (typingUser === currentUser) {
              setTypingUser(null);
            }
          });
        }
    
        return () => {
          if (socket) {
            socket.off("typing");
            socket.off("stopTyping");
          }
        };
    }, [socket, typingUser, messageReciever]);

    const handleTyping = () => {
    if (!isTyping) {
        setIsTyping(true);
        socket.emit("typing", { senderId: currentUser.uid, receiverId: messageReciever?.uid });
    }
    // Clear typing after a delay (e.g., 2 seconds) after the last keystroke
    const timeoutId = setTimeout(() => {
        setIsTyping(false);
        socket.emit("stopTyping", { senderId: currentUser.uid, receiverId: messageReciever?.uid });
    }, 5000);

    return () => clearTimeout(timeoutId);
    };
    
    const handleChange = (e) => {
        setMessage(e.target.value)
        handleTyping()
    }
    
    
    return (
        <div className="col-8 border chat-layout">
            <div className="chat-header py-2">
            {
                messageReciever ? 
                (<span>To: {messageReciever?.displayName}
                    <sup><i className="bi bi-circle-fill mx-2" style={isOnline ? {color: 'green'} : {color: 'white'}}></i></sup>
                </span>)
                : ''
            }
                    <p><i  className="h6 text-center my-2">{typingUser ? `Typing...` : ''}</i></p>
            
            </div>
            <ul className="chat-container">
                {!messageReciever ? <p className="text-center py-3">Select a chat to start messaging </p>:
                !conversation ? 
                <p className="text-center">Start chatting</p> 
                :
                conversation?.map((chat, id) => (
                    <li className={
                            chat.senderId === currentUser.uid
                                ? 'right-message'
                                : 'left-message'
                        }
                        key={chat._id}
                        ref={id === conversation.length - 1 ? lastMessage : null}
                    >
                        <p className="message">
                            {chat.message}
                            <span className="message-time">
                                {new Date(chat.createdAt).toLocaleTimeString()}
                            </span>
                        </p>
                    </li>
                ))}
            </ul>
            <div className="message-container">
                <form className="message-form" onSubmit={handleSubmit}>
                    <input type="text" value = {message} className="message-input" placeholder="Text Message" onChange={handleChange}/>
                    <div className="v-divider"></div>
                    <button type="submit" className="btn btn-dark send-btn">
                            <span><i className="bi bi-send-fill"></i></span>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChatLayout