import { useParams } from "react-router-dom";
import { RoomChat } from "../components/room-chat";

export default function RoomPage() {
  const { roomId } = useParams();

  if (!roomId) {
    return <div>Room ID is required</div>;
  }
  return (
    <div>
      <RoomChat roomId={roomId} />
    </div>
  );
}
