import { useEffect, useCallback } from 'react';

const useSeenStatus = (socket, currentUser, contactId) => {
    const markMessagesAsSeen = useCallback(() => {
        if (socket && contactId) {
            socket.emit("messageSeen", { senderId: contactId, receiverId: currentUser.uid });
        }
    }, [socket, currentUser, contactId]);

    useEffect(() => {
        markMessagesAsSeen();
    }, [markMessagesAsSeen]);

    return { markMessagesAsSeen };
};

export default useSeenStatus;
