import { useCallback, useEffect, useRef, useState } from "react"
import { deleteMessageById, getMessagesById, sendMessage } from "../../service/service"
import { useAuth } from "../../context/AuthContext"
import { useSocketContext } from "../../context/SocketContext"
import { dateParser, timeParser } from "../../utils/dateParser"
import './Chats.css'


const Chats = () => {
    const { contacts , currentUser} = useAuth()
    const { onlineUsers, socket } = useSocketContext()

    const [conversation, setConversation] = useState([])
    const [message, setMessage] = useState('')

    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const [loading, setLoading] = useState(false)
    const lastMessage = useRef(null)

    const isOnline = onlineUsers.includes(contacts?.uid)

    // Fetch Messages by contact user Id
    const fetchData = useCallback(async(id) => {
        try 
        {
            setLoading(true)
            const data = await getMessagesById(id)
            const messages = Array.isArray(data) ? data : [];
            setConversation(messages)
        } 
        catch (error) 
        {
            console.log("Error in fetching message by Id", error);
        }
        finally
        {
            setLoading(false)
        }
        
    },[setLoading])

    useEffect(() => {
        fetchData(contacts.uid)
    },[fetchData, contacts])
    
    
    // Scroll to the last message
    useEffect(() => {
        if (lastMessage.current) {
            lastMessage.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversation]);


    // Display typing message
    useEffect(() => {
        if (socket) 
        {

            socket.on("typing", (currentUser) => {
                if (currentUser === contacts?.uid) 
                {
                    setTypingUser(currentUser);
                }
            });
    
            socket.on("stopTyping", (currentUser) => {
                if (typingUser === currentUser) 
                {
                    setTypingUser(null);
                }
            });
        }
    
        return () => {
            if (socket)
            {
                socket.off("typing");
                socket.off("stopTyping");
            }
        };
    }, [socket, typingUser, contacts]);


    // Handlers

    const handleTyping = () => {
        if (!isTyping) 
        {
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        try 
        {
            if(!message)
            {
                return;
            }
            await sendMessage(message, contacts.uid)
            await fetchData(contacts.uid)
            setMessage('')
        } 
        catch (error) 
        {
            alert("Error", error);
            
        }
    }

    const handleDelete = async (messageId) => {
        const response = await deleteMessageById(messageId)
        console.log(response); // display deleted response
        
        fetchData(contacts.uid)
        
    }

    const handleContextMenu = (e) => {
        e.preventDefault()
        console.log("menu"); // Todo context menu
    }
    
    
    return (
        <div className="col-8 chat-layout">
            {Array.isArray(contacts) && contacts.length === 0 ? null : (
                <div className="chat-header">
                    <div className="chat-header-info">
                        <p className="contact-name">{contacts?.displayName}</p>
                        <span className={`status ${isOnline ? 'online' : 'offline'}`}>
                            {isOnline ? 'Online' : 'Offline'}
                        </span>
                    </div>
                    <i className="typing-status">{typingUser ? 'typing...' : ''}</i>
                </div>
            )}

            <ul className="chat-container">
                {
                    loading ? <p className="line-loader"></p> 
                    :
                    contacts.length === 0 ? (
                        <p className="sample-message">Select a chat to start messaging</p>
                    ) : conversation.length === 0 ? (
                        <p className="sample-message">Start a message with Hi! 👋</p>
                    ) : (
                        conversation?.map((chat, id) => {
                        // Get the date of the current message
                        const currentDate = dateParser(chat.createdAt);
                        // Get the date of the previous message, if it exists
                        const previousDate = id > 0 ? dateParser(conversation[id - 1].createdAt) : null;

                        return (
                            <li key={chat._id} className="chat-box" onContextMenu={handleContextMenu}>

                                {currentDate !== previousDate && <p className="date">{currentDate}</p>}

                                <div className={`message-box ${chat.senderId === currentUser.uid ? 'right-message' : 'left-message'}`} 
                                    ref={id === conversation.length - 1 ? lastMessage : null}
                                >
                                        <p className="message"> {chat.message}</p>
                                        {/* <p className="message">
                                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iusto veritatis consequatur facere cupiditate reprehenderit quod cum eveniet. Laudantium alias odio, aliquam atque quae ab repellendus autem! Quibusdam neque placeat nobis.
                                        </p> */}
                                        <div className="message-info">
                                            <p className="timestamp">{timeParser(chat.createdAt)}</p>
                                            <div>
                                                <i className="bi bi-check2"></i>
                                                {/* <i class="bi bi-check2"></i> */}
                                                <i className="bi bi-info-lg" onClick={() => handleDelete(chat._id)}></i>
                                            </div>
                                        </div>
                                        
                                </div>
                                
                            </li>
                        )})
                    )}
            </ul>

            {
                contacts.length === 0 ? "" 
                :
                <div className="message-container">
                    <form className="message-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={message}
                            className="message-input"
                            placeholder="Type a message"
                            onChange={handleChange}
                        />
                        <div className="v-divider"></div>
                        <button type="submit" className="btn send-btn">
                            <i className="bi bi-send"></i>
                        </button>
                    </form>
                </div>
            }
            
        </div>

    )
}

export default Chats