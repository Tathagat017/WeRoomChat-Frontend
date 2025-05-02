import {
  faBolt,
  faCheck,
  faClock,
  faGlobe,
  faLock,
  faSearch,
  faSignInAlt,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Group,
  ScrollArea,
  Select,
  SimpleGrid,
  Switch,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../hooks/use-query";
import { useStore } from "../hooks/use-store";
import { QueryKeys } from "../types/query-keys";

const statusBadgeMap = {
  scheduled: {
    color: "indigo",
    icon: faClock,
    label: "Scheduled",
  },
  live: {
    color: "green",
    icon: faBolt,
    label: "Live",
  },
  closed: {
    color: "gray",
    icon: faCheck,
    label: "Closed",
  },
};

const Rooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showPublicOnly, setShowPublicOnly] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 300); // 300ms delay
  const navigate = useNavigate();
  const { roomStore, authStore } = useStore();
  const userId = authStore.UserId;

  const { data: rooms = [] } = useQuery({
    queryKey: [QueryKeys.Rooms],
    queryFn: async () => {
      const result = await roomStore.fetchAllRooms();
      return result ?? [];
    },
  });

  const { data: users } = useQuery({
    queryKey: [QueryKeys.AllUsers],
    queryFn: async () => {
      const result = await authStore.fetchAllUsers();
      return result;
    },
  });

  // Function to determine the room status based on current time
  const getRoomStatus = (roomStartTime: string, roomEndTime: string) => {
    const currentTime = new Date();
    const startTime = new Date(roomStartTime);
    const endTime = new Date(roomEndTime);

    if (currentTime < startTime) {
      return "scheduled"; // Room is in the future
    } else if (currentTime >= startTime && currentTime <= endTime) {
      return "live"; // Room is ongoing
    } else {
      return "closed"; // Room is in the past
    }
  };

  // Update the rooms status dynamically based on time
  const updatedRooms = useMemo(() => {
    return rooms.map((room) => {
      const dynamicStatus = getRoomStatus(room.startTime, room.endTime);
      return { ...room, status: dynamicStatus };
    });
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    return updatedRooms.filter((room) => {
      const matchesSearch =
        room.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        room.description
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());

      const matchesType = showPublicOnly
        ? room.type === "public"
        : room.type === "private" &&
          (room.creator === userId ||
            room.participants.includes(userId ?? "0"));

      const matchesStatus = !statusFilter || room.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [updatedRooms, debouncedSearchTerm, showPublicOnly, statusFilter, userId]);

  return (
    <Box p="md">
      {/* ✅ Top Panel: Search & Filters */}
      <Flex gap={4} mb={"md"} align="center">
        <Tooltip
          label={
            showPublicOnly ? "Showing public rooms" : "Showing private rooms"
          }
        >
          <Switch
            checked={showPublicOnly}
            onChange={(e) => setShowPublicOnly(e.currentTarget.checked)}
            labelPosition="left"
            label={
              showPublicOnly ? (
                <FontAwesomeIcon icon={faGlobe} size={"1x"} />
              ) : (
                <FontAwesomeIcon icon={faLock} size={"1x"} />
              )
            }
          />
        </Tooltip>
        <TextInput
          placeholder="Search rooms..."
          icon={<FontAwesomeIcon icon={faSearch} size={"1x"} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          style={{ flex: 1, minWidth: 200 }}
        />

        <Select
          data={["scheduled", "live", "closed"]}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Filter by status"
          style={{ width: 160 }}
          clearable
        />
      </Flex>

      {/* ✅ Bottom Panel: Rooms Grid */}
      <Box style={{ height: "calc(100vh - 200px)", overflowY: "auto" }}>
        <ScrollArea>
          <SimpleGrid
            cols={3}
            spacing="md"
            breakpoints={[
              { maxWidth: "md", cols: 2 },
              { maxWidth: "sm", cols: 1 },
            ]}
          >
            {filteredRooms.map((room) => {
              const creator = users?.find((u) => u.id === room.creator);

              return (
                <Card key={room.id} shadow="sm" padding="md" withBorder>
                  <Group position="apart">
                    <Text fw={500} truncate>
                      {room.title}
                    </Text>

                    <Group>
                      <Badge
                        color={
                          statusBadgeMap[
                            room.status as keyof typeof statusBadgeMap
                          ].color
                        }
                        leftSection={
                          <FontAwesomeIcon
                            icon={
                              statusBadgeMap[
                                room.status as keyof typeof statusBadgeMap
                              ].icon
                            }
                            size="xs"
                          />
                        }
                        variant="light"
                      >
                        {
                          statusBadgeMap[
                            room.status as keyof typeof statusBadgeMap
                          ].label
                        }
                      </Badge>

                      <Tooltip label={room.type}>
                        {room.type === "public" ? (
                          <FontAwesomeIcon icon={faGlobe} size={"1x"} />
                        ) : (
                          <FontAwesomeIcon icon={faLock} size={"1x"} />
                        )}
                      </Tooltip>
                    </Group>
                  </Group>

                  <Text size="sm" mt="xs" lineClamp={2}>
                    {room.description}
                  </Text>

                  <Badge mt="sm" color="blue">
                    {room.tags}
                  </Badge>

                  <Text size="xs" mt="xs">
                    {format(new Date(room.startTime), "MMM d, HH:mm")} –{" "}
                    {format(new Date(room.endTime), "MMM d, HH:mm")}
                  </Text>

                  {creator && (
                    <Text size="xs" mt="xs" c="dimmed">
                      Created by: <b>{creator.full_name}</b> ({creator.email})
                    </Text>
                  )}

                  {room.status === "live" && (
                    <Group mt="md" grow>
                      <Button
                        leftIcon={
                          <FontAwesomeIcon icon={faSignInAlt} size={"1x"} />
                        }
                        fullWidth
                        onClick={() => navigate(`/room/${room.id}`)}
                      >
                        Join
                      </Button>
                      <Button
                        variant="outline"
                        leftIcon={
                          <FontAwesomeIcon icon={faUsers} size={"1x"} />
                        }
                        fullWidth
                      >
                        Participants
                      </Button>
                    </Group>
                  )}

                  {room.status === "closed" && (
                    <Button
                      mt="md"
                      variant="outline"
                      color="blue"
                      onClick={() => navigate(`/room/chatHistory/${room.id}`)}
                    >
                      Show chats
                    </Button>
                  )}
                </Card>
              );
            })}
          </SimpleGrid>
        </ScrollArea>
      </Box>
    </Box>
  );
};

export default Rooms;
