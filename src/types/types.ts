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

export type Invitation = {
  id: string;
  roomId: string;
  roomTitle: string;
  invitedBy: string;
  status: "pending" | "accepted" | "declined";
};

export interface RoomFormInput {
  title: string;
  description: string;
  type: "private" | "public";
  startTime: string; // ISO string or Date object depending on your implementation
  endTime: string;
  maxParticipants?: number;
  tag: "Hangout" | "Work" | "Brainstorm" | "Wellness" | string; // add more tags as needed
  invitedUsers?: string[]; // usernames or user IDs
}
