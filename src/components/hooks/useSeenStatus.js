import { useEffect, useCallback } from 'react';

const useSeenStatus = (socket, currentUser, contactId) => {
    const markMessagesAsSeen = useCallback(() => {
        if (socket && contactId) {
            socket.emit("messageSeen", { senderId: currentUser.uid, receiverId: contactId });
        }
    }, [socket, currentUser, contactId]);

    useEffect(() => {
        markMessagesAsSeen();
    }, [markMessagesAsSeen]);

    return { markMessagesAsSeen };
};

export default useSeenStatus;
