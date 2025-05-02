import { useEffect, useState, useRef } from "react";
import { socket } from "../utils/socket";
import { useQuery } from "../hooks/use-query";
import { QueryKeys } from "../types/query-keys";
import {
  Box,
  ScrollArea,
  Card,
  Group,
  Avatar,
  Text,
  Textarea,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import { ChatMessage } from "../types/types";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { useStore } from "../hooks/use-store";

interface RoomChatProps {
  roomId: string;
}

export const RoomChat = ({ roomId }: RoomChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { authStore } = useStore();

  // Fetch initial chat history
  const { isLoading } = useQuery({
    queryKey: [QueryKeys.RoomChat, roomId],
    queryFn: async () => {
      const response = await fetch(`${authStore.BaseUrl}chats/${roomId}`, {
        headers: {
          Authorization: `Bearer ${authStore.Token}`,
        },
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(data.chats || []);
    },
    enabled: !!roomId,
  });

  // Socket.IO setup
  useEffect(() => {
    socket.emit("joinRoom", { roomId, userId: authStore.UserId });

    // Handle incoming messages
    const handleReceiveMessage = (message: ChatMessage) => {
      setMessages((prevMessages) => {
        if (!prevMessages.some((msg) => msg._id === message._id)) {
          return [...prevMessages, message];
        }
        return prevMessages;
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [roomId, authStore.UserId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Optimistic update before sending
    const tempMessage: ChatMessage = {
      _id: Date.now().toString(),
      roomId,
      sender: {
        _id: authStore.UserId,
        full_name: authStore.User?.full_name ?? "",
        email: authStore.User.email,
      },
      message: newMessage,
      type: "text",
      createdAt: new Date(),
    };

    // Avoid adding duplicate message in optimistic update
    setMessages((prev) => {
      if (!prev.some((msg) => msg._id === tempMessage._id)) {
        return [...prev, tempMessage];
      }
      return prev;
    });

    setIsSending(true);

    // Emit message to backend (Socket.IO)
    socket.emit("sendMessage", {
      roomId,
      senderId: authStore.UserId,
      message: newMessage,
      type: "text",
    });

    setNewMessage(""); // Clear the input field after sending
    setIsSending(false); // Stop the sending state
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline on Enter key
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <LoadingOverlay visible={isLoading} />
      <Box sx={{ flex: 1, overflowY: "auto", paddingBottom: "60px" }}>
        <ScrollArea sx={{ height: "100%" }} ref={scrollRef}>
          <Box p="md">
            {messages.map((message) => (
              <Card key={message._id} p="sm" sx={{ marginBottom: "md" }}>
                <Group spacing="xs" align="flex-start">
                  <Avatar>{message.sender?.full_name.charAt(0)}</Avatar>
                  <Box>
                    <Text size="sm" fw={500}>
                      {message.sender?.full_name}
                    </Text>
                    <Text>{message.message}</Text>
                    <Text size="xs" color="dimmed">
                      {format(new Date(message.createdAt), "HH:mm")}
                    </Text>
                  </Box>
                </Group>
              </Card>
            ))}
          </Box>
        </ScrollArea>
      </Box>

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "md",
          backgroundColor: "white",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            border: "1px solid #dcdfe6",
            borderRadius: "8px",
            padding: "5px",
          }}
        >
          <Textarea
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.currentTarget.value)}
            disabled={isSending}
            sx={{
              flex: 1,
              border: "none",
              outline: "none",
              resize: "none",
              padding: "5px",
            }}
            onKeyDown={handleKeyDown} // Handle Enter key press
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            leftIcon={<FontAwesomeIcon icon={faPaperPlane} />}
            sx={{
              marginLeft: "8px",
              padding: "0 15px",
              height: "36px",
              borderRadius: "8px",
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
