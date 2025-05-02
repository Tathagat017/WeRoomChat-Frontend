export type Room = {
  id: string;
  title: string;
  description: string;
  type: "public" | "private";
  startTime: string;
  endTime: string;
  tags: string[];
  maxParticipants?: number;
  status: "scheduled" | "live" | "closed";
  participants: string[];
  creator: string;
};

export type RoomType = "public" | "private";
export interface RoomFormInput {
  title: string;
  description: string;
  room_type: RoomType;
  start_time: Date;
  end_time: Date;
  max_participants?: number;
  tag: "Hangout" | "Work" | "Brainstorm" | "Wellness" | string;
  invited_users?: string[];
}

export interface InvitationNotification {
  message: string;
  roomId: string;
  roomTitle: string;
  invitedBy: string;
  invitationId: string;
  status: "pending" | "accepted" | "declined";
}

// types/chat.ts// types/types.ts
export interface ChatMessage {
  _id: string;
  roomId: string;
  sender: {
    _id: string;
    full_name: string;
    email: string;
  };
  message: string;
  type: "text" | "reaction";
  createdAt: Date;
}

export interface User {
  _id: string;
  full_name: string;
  email: string;
}
