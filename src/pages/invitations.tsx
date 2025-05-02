import { useStore } from "../hooks/use-store";
import { QueryKeys } from "../types/query-keys";
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { InvitationNotification } from "../types/types";
import { useQuery } from "../hooks/use-query";
import { format } from "date-fns";
import { useState } from "react";
export const Invitations = () => {
  const { authStore, roomStore } = useStore();

  // Fetch the user's invitations
  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Invitations],
    queryFn: async () => {
      const result = await roomStore.fetchUserInvitations();
      return result;
    },
  });

  // Show loading or error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Combine the socket notifications with fetched invitations
  const notifications: InvitationNotification[] = [
    ...new Set([...authStore.socketStore.notifications, ...(data ?? [])]), // Merge and remove duplicates
  ];

  return (
    <Container>
      <Title order={2}>{"Invitations"}</Title>
      <Stack spacing="md">
        {notifications.map((notification) => (
          <InvitationCard
            key={notification.invitationId}
            notification={notification}
          />
        ))}
      </Stack>
    </Container>
  );
};

const InvitationCard = ({
  notification,
}: {
  notification: InvitationNotification;
}) => {
  const { roomStore } = useStore();
  const [status, setStatus] = useState<"pending" | "accepted" | "declined">(
    notification.status || "pending"
  );

  const { data: rooms } = useQuery({
    queryKey: [QueryKeys.Rooms],
    queryFn: async () => {
      const result = await roomStore.fetchAllRooms();
      return result ?? [];
    },
  });

  const selectedRoom = rooms?.find((room) => room?.id == notification.roomId);

  const handleAccept = async () => {
    try {
      setStatus("accepted");
      await roomStore.acceptInvitation(notification.roomId);
      console.log("Invitation accepted:", notification.invitationId);
    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  };

  const handleDecline = async () => {
    try {
      await roomStore.rejectInvitation(notification.roomId);
      setStatus("declined");
      console.log("Invitation declined:", notification.invitationId);
    } catch (error) {
      console.error("Error declining invitation:", error);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group position="apart">
        <div>
          <Text weight={500}>{selectedRoom?.title ?? ""}</Text>
          <Text size="sm" color="dimmed">
            {`Starts at: ${format(
              new Date(selectedRoom?.startTime ?? ""),
              "MMM d, HH:mm"
            )}`}
          </Text>
        </div>
        {status !== "pending" ? (
          <Badge
            color={status === "accepted" ? "green" : "red"}
            variant="filled"
          >
            {status === "accepted" ? "Accepted" : "Declined"}
          </Badge>
        ) : (
          <Group spacing="sm">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              disabled={status !== "pending"}
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              disabled={status !== "pending"}
            >
              Accept
            </Button>
          </Group>
        )}
      </Group>
    </Card>
  );
};
