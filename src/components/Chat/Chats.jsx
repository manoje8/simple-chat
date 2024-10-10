import { useCallback, useEffect, useRef, useState } from "react"
import { getMessages, sendMessage } from "../../service/service"
import { useAuth } from "../../context/AuthContext"
import { useSocketContext } from "../../context/SocketContext"
import './Chats.css'
import { dateParser } from "../../utils/dateParser"

const Chats = () => {
    const { contacts , currentUser} = useAuth()
    const { onlineUsers, socket } = useSocketContext()

    const [conversation, setConversation] = useState([])
    const [message, setMessage] = useState('')

    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const lastMessage = useRef(null)

    const isOnline = onlineUsers.includes(contacts?.uid)

    const fetchData = useCallback(async(id) => {
        const data = await getMessages(id)
        const messages = Array.isArray(data) ? data : [];
        
        setConversation(messages)
        
    },[])

    useEffect(() => {
        fetchData(contacts.uid)
    },[fetchData, contacts])
    
    useEffect(() => {
        if (lastMessage.current) {
            lastMessage.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversation]);

    useEffect(() => {
        if (socket) {
          socket.on("typing", (currentUser) => {
            if (currentUser === contacts?.uid) {
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
    }, [socket, typingUser, contacts]);

    // Handlers
    const handleSubmit = async (e) => {
        e.preventDefault()
        try 
        {
            await sendMessage(message, contacts.uid)
            await fetchData()
            setMessage('')
        } 
        catch (error) 
        {
            alert("Error", error);
            
        }
    }

    const handleTyping = () => {
        if (!isTyping) {
            setIsTyping(true);
            socket.emit("typing", { senderId: currentUser.uid, receiverId: contacts?.uid });
        }
        // Clear typing after a delay (e.g., 2 seconds) after the last keystroke
        const timeoutId = setTimeout(() => {
            setIsTyping(false);
            socket.emit("stopTyping", { senderId: currentUser.uid, receiverId: contacts?.uid });
        }, 5000);

        return () => clearTimeout(timeoutId);
    };
    
    const handleChange = (e) => {
        setMessage(e.target.value)
        handleTyping()
    }
    
    
    return (
        <div className="col-8 chat-layout">
            <div className="chat-header">
                {
                    contacts ? 
                    (<p>{contacts?.displayName}
                        <sup><i className="bi bi-circle-fill mx-2" style={isOnline ? {color: 'green'} : {display: 'none'}}></i></sup>
                    </p>)
                    : ''
                }
                <i>{typingUser ? `Typing...` : ''}</i>
            
            </div>
            <ul className="chat-container">
                {
                contacts.length === 0 ? <p className="text-center py-3">Select a chat to start messaging </p>
                :
                conversation.length === 0  ? 
                <p className="start-message">Start a message with Hi! 👋</p> 
                :
                conversation?.map((chat, id) => (
                    <li className={chat.senderId === currentUser.uid? 'right-message': 'left-message' }
                        key={chat._id}
                        ref={id === conversation.length - 1 ? lastMessage : null}
                    >
                        <p className="message">
                            {chat.message}
                            <span className="message-time">{dateParser(chat.createdAt)}</span>
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

export default Chats