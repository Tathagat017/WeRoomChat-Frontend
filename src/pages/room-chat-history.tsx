import { useParams } from "react-router-dom";
import { PreviousChats } from "../components/chat-history";

export default function RoomChatHistory() {
  const { roomId } = useParams();

  if (!roomId) {
    return <div>Room ID is required</div>;
  }
  return (
    <div>
      <PreviousChats roomId={roomId} />
    </div>
  );
}
