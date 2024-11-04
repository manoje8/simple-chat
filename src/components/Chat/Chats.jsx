import { useCallback, useEffect, useRef, useState } from "react"
import { deleteMessageById, getMessagesById, sendMessage } from "../../service/service"
import { useAuth } from "../../context/AuthContext"
import { useSocketContext } from "../../context/SocketContext"
import { dateParser, timeParser } from "../../utils/dateParser"
import ContextMenu from "./ContextMenu.jsx"
import useTyping from "../hooks/useTyping.js"
import useMessageStatus from "../hooks/useMessageStatus.js"
import useSeenStatus from "../hooks/useSeenStatus.js"
import './Chats.css'


const Chats = () => {
    const { contacts , currentUser} = useAuth()
    const { onlineUsers, socket } = useSocketContext()

    const [conversation, setConversation] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [deleteMessageId, setDeleteMessageId] = useState('')
    const lastMessage = useRef(null)


    const isOnline = onlineUsers.includes(contacts?.uid)

    // Custom hooks for socket events
    const { typingUser, handleTyping, handleStopTyping } = useTyping(socket, currentUser, contacts?.uid);
    useMessageStatus(socket, setConversation);
    // Todo:
    // const { markMessagesAsSeen } = useSeenStatus(socket, currentUser, contacts?.uid);

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

    // useEffect(() => {
    //     if (contacts?.uid) {
    //         markMessagesAsSeen();
    //     }
    // }, [contacts, markMessagesAsSeen]);

    // Handlers
    const handleChange = (e) => {
        setMessage(e.target.value)
        handleTyping()

        const stopTypingTimeout = setTimeout(() => {
            handleStopTyping();
        }, 2000);

        return () => clearTimeout(stopTypingTimeout);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!message.trim()) return;
        try 
        {   
            const { message: sentMessage } = await sendMessage({ message, status: "sent" }, contacts.uid);
            // Emit "messageSent" with message ID and receiver ID
            socket.emit("messageSent", { messageId: sentMessage._id, receiverId: contacts.uid });

            await fetchData(contacts.uid)
            setMessage('')
        } 
        catch (error) 
        {
            alert("Error", error);            
        }
    }

    const handleDelete = async () => {
        try 
        {
            await deleteMessageById(deleteMessageId)
            fetchData(contacts.uid)
            setShowMenu(false)
        }
        catch (error) 
        {
            alert("Error deleting message:", error);
        }
    }

    const toggleMenu  = (messageId) => {
        setDeleteMessageId(messageId)
        handleMenu()
    }

    const handleMenu = async () => {
        setShowMenu(!showMenu)
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

                        const currentDate = dateParser(chat.createdAt);
                        // Get the date of the previous message, if it exists
                        const previousDate = id > 0 ? dateParser(conversation[id - 1].createdAt) : null;

                        return (
                            <li key={chat._id} className="chat-box">

                                {currentDate !== previousDate && <p className="date">{currentDate}</p>}

                                <div className={`message-box ${chat.senderId === currentUser.uid ? 'right-message' : 'left-message'}`} 
                                    ref={id === conversation.length - 1 ? lastMessage : null}
                                >
                                        <p className="message"> {chat.message}</p>
                                        <div className="message-info">
                                            <p className="timestamp">{timeParser(chat.createdAt)}</p>
                                            {
                                                chat.senderId === currentUser.uid ? (
                                                    <div className="double-tick">
                                                        {chat.status === "sent" && <i className="bi bi-check2"></i>}
                                                        {chat.status === "delivered" && (
                                                            <div>
                                                                <i className="bi bi-check2"></i>
                                                                <i className="bi bi-slash"></i>
                                                            </div>
                                                        )}
                                                        
                                                    </div>
                                                ) 
                                                : ""
                                            }
                                            <i className="bi bi-info-lg" onClick={() => toggleMenu(chat._id)}></i>
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

            <div>
                {
                    showMenu ? <ContextMenu showMenu={showMenu} handleMenu={handleMenu} handleDelete={handleDelete}/> : ""
                }
            </div>
            
        </div>

    )
}

export default Chats