import {
  Avatar,
  Box,
  Card,
  Group,
  LoadingOverlay,
  ScrollArea,
  Text,
  TextInput,
  Button,
} from "@mantine/core";
import { format } from "date-fns";
import { useRef, useState } from "react";
import { useQuery } from "../hooks/use-query";
import { useStore } from "../hooks/use-store";
import { QueryKeys } from "../types/query-keys";
import { ChatMessage } from "../types/types";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

interface PreviousChatsProps {
  roomId: string;
}

export const PreviousChats = ({ roomId }: PreviousChatsProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { authStore } = useStore();
  const navigate = useNavigate(); // Initialize navigate function from react-router-dom

  // Fetch initial chat history for closed rooms
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
      setFilteredMessages(data.chats || []);
    },
    enabled: !!roomId,
  });

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase();

    // Filter messages based on search query
    const filtered = messages.filter((message) =>
      message.message.toLowerCase().includes(query)
    );
    setFilteredMessages(filtered);
  };

  // Back button click handler
  const handleBackClick = () => {
    navigate("/rooms"); // Navigate to "/room" page when the back button is clicked
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <LoadingOverlay visible={isLoading} />

      {/* Title, Search, and Back Button */}
      <Box
        p="md"
        sx={{
          backgroundColor: "#f5f5f5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text size="xl" weight={700}>
          Group Chat History
        </Text>
        <Button variant="outline" onClick={handleBackClick}>
          Back
        </Button>
      </Box>

      <Box p="md" sx={{ backgroundColor: "#f5f5f5" }}>
        <TextInput
          placeholder="Search messages..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ marginTop: "10px" }}
        />
      </Box>

      {/* Chat History Display */}
      <Box sx={{ flex: 1, overflowY: "auto", paddingBottom: "60px" }}>
        <ScrollArea sx={{ height: "100%" }} ref={scrollRef}>
          <Box p="md">
            {filteredMessages.map((message) => (
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
    </Box>
  );
};
