import { useEffect, useCallback, useState } from 'react';

const useTyping = (socket, currentUser, contactId) => {
    const [typingUser, setTypingUser] = useState(null);

    const handleTyping = useCallback(() => {
        socket.emit("typing", { senderId: currentUser.uid, receiverId: contactId });
    }, [socket, currentUser, contactId]);

    const handleStopTyping = useCallback(() => {
        socket.emit("stopTyping", { senderId: currentUser.uid, receiverId: contactId });
    }, [socket, currentUser, contactId]);

    useEffect(() => {
        if (!socket) return;

        const onTyping = (userId) => {
            if (userId === contactId) setTypingUser(userId);
        };

        const onStopTyping = (userId) => {
            if (userId === typingUser) setTypingUser(null);
        };

        socket.on("typing", onTyping);
        socket.on("stopTyping", onStopTyping);

        return () => {
            socket.off("typing", onTyping);
            socket.off("stopTyping", onStopTyping);
        };
    }, [socket, contactId, typingUser]);

    return { typingUser, handleTyping, handleStopTyping };
};

export default useTyping;
