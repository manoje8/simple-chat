import { useEffect } from 'react';

const useMessageStatus = (socket, setConversation) => {
    useEffect(() => {
        if (!socket) return;

        const handleStatusUpdate = ({ messageId, status }) => {
            setConversation((prev) =>
                prev.map((msg) => (msg._id === messageId ? { ...msg, status } : msg))
            );
        };

        socket.on("messageStatusUpdate", handleStatusUpdate);

        return () => {
            socket.off("messageStatusUpdate", handleStatusUpdate);
        };
    }, [socket, setConversation]);
};

export default useMessageStatus;
