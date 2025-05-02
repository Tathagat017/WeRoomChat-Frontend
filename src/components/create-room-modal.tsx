import {
  Button,
  Flex,
  Modal,
  NumberInput,
  Select,
  Stack,
  Textarea,
  Text,
  TextInput,
} from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useStore } from "../hooks/use-store";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useReducer, useState } from "react";
import { RoomFormInput, RoomType } from "../types/types";
import { notifications } from "@mantine/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MultiSelect } from "@mantine/core";

import {
  faCirclePlus,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "../hooks/use-query";
import { QueryKeys } from "../types/query-keys";

const initialState = {
  title: "",
  description: "",
  room_type: "public",
  tag: "Coding",
  start_time: new Date(),
  end_time: new Date(),
  max_participants: 10,
  invited_users: [] as string[],
};

type Action =
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_ROOM_TYPE"; payload: "public" | "private" }
  | { type: "SET_TAG"; payload: string }
  | { type: "SET_START_TIME"; payload: Date }
  | { type: "SET_END_TIME"; payload: Date }
  | { type: "SET_MAX_PARTICIPANTS"; payload: number }
  | { type: "SET_INVITED_USERS"; payload: string[] };

function reducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_ROOM_TYPE":
      return { ...state, room_type: action.payload };
    case "SET_TAG":
      return { ...state, tag: action.payload };
    case "SET_START_TIME":
      return { ...state, start_time: action.payload };
    case "SET_END_TIME":
      return { ...state, end_time: action.payload };
    case "SET_MAX_PARTICIPANTS":
      return { ...state, max_participants: action.payload };
    case "SET_INVITED_USERS":
      return { ...state, invited_users: action.payload };
    default:
      return state;
  }
}

export const CreateRoomModal = observer(function CreateRoomModal() {
  const { uiViewStore, roomStore, authStore } = useStore();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data } = useQuery({
    queryKey: [QueryKeys.AllUsers],
    queryFn: async () => {
      const result = await authStore.fetchAllUsers();
      return result;
    },
  });

  const availableUsers = (data ?? []).map((user) => ({
    label: user.full_name,
    value: user.id ?? "0",
  }));

  const handleModalClose = () => {
    uiViewStore.CreateRoomModalOpen = false;
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!state.title.trim()) newErrors.title = "Title is required";
    if (!state.room_type) newErrors.room_type = "Room type is required";
    if (!state.tag) newErrors.tag = "Tag is required";
    if (!state.start_time) newErrors.start_time = "Start time is required";
    if (!state.end_time) newErrors.end_time = "End time is required";
    if (state.end_time <= state.start_time)
      newErrors.end_time = "End time must be after start time";
    return newErrors;
  };

  const handleRoomCreation = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const createRoomRequest: RoomFormInput = {
      description: state.description,
      title: state.title,
      end_time: state.end_time,
      start_time: state.start_time,
      room_type: state.room_type as RoomType,
      tag: state.tag,
      invited_users: state.invited_users,
      max_participants: state.max_participants,
    };
    const result = await roomStore.createRoom(createRoomRequest);
    if (result) {
      notifications.show({
        title: "Room creation successful",
        withCloseButton: true,
        icon: <FontAwesomeIcon icon={faCirclePlus} size="1x" />,
        message: `You have successfully created the ${createRoomRequest.title} room`,
      });
      handleModalClose();
    } else {
      notifications.show({
        title: "Room creation failed",
        withCloseButton: true,
        icon: (
          <FontAwesomeIcon icon={faCircleExclamation} size="1x" color="red" />
        ),
        message: `Failed to create ${createRoomRequest.title} room`,
      });
    }
  };

  const roomTypeOptions = [
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
  ];

  const tagOptions = ["Coding", "Gaming", "Music", "Chill"].map((tag) => ({
    label: tag,
    value: tag,
  }));

  return (
    <Modal
      opened={uiViewStore.CreateRoomModalOpen}
      onClose={handleModalClose}
      title="Create a Room"
      closeOnClickOutside
      yOffset="65px"
      size="xl"
    >
      <Stack>
        <TextInput
          label="Room Title"
          value={state.title}
          onChange={(e) =>
            dispatch({ type: "SET_TITLE", payload: e.target.value })
          }
          error={errors.title}
        />
        <Textarea
          label="Description"
          value={state.description}
          onChange={(e) =>
            dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })
          }
        />
        <Select
          label="Room type"
          data={roomTypeOptions}
          value={state.room_type}
          onChange={(val) =>
            dispatch({
              type: "SET_ROOM_TYPE",
              payload: val as "public" | "private",
            })
          }
          error={errors.room_type}
        />
        <MultiSelect
          label="Invite Users"
          placeholder="Select users to invite"
          data={availableUsers}
          value={state.invited_users}
          onChange={(val) =>
            dispatch({ type: "SET_INVITED_USERS", payload: val })
          }
          searchable
          clearable
          maxDropdownHeight={150}
        />

        <Flex gap={5} w="100%">
          <Stack w="50%">
            <Text size="sm" fw={500}>
              Start Time
            </Text>
            <DatePicker
              selected={state.start_time}
              withPortal
              showTimeInput
              onChange={(date) => {
                if (date) {
                  dispatch({ type: "SET_START_TIME", payload: date });
                }
              }}
              showTimeSelect
              dateFormat="Pp"
              showIcon
              className="custom-datepicker"
              popperPlacement="bottom"
            />
            {errors.start_time && (
              <Text c="red" size="xs">
                {errors.start_time}
              </Text>
            )}
          </Stack>

          <Stack w="50%">
            <Text size="sm" fw={500}>
              End Time
            </Text>
            <DatePicker
              selected={state.end_time}
              withPortal
              showTimeInput
              onChange={(date) => {
                if (date) {
                  dispatch({ type: "SET_END_TIME", payload: date });
                }
              }}
              showTimeSelect
              dateFormat="Pp"
              showIcon
              className="custom-datepicker"
              popperPlacement="bottom"
            />
            {errors.end_time && (
              <Text c="red" size="xs">
                {errors.end_time}
              </Text>
            )}
          </Stack>
        </Flex>
        <Select
          label="Tag"
          data={tagOptions}
          value={state.tag}
          onChange={(val) => dispatch({ type: "SET_TAG", payload: val! })}
          error={errors.tag}
        />
        <NumberInput
          label="Max participants"
          value={state.max_participants}
          onChange={(val) =>
            dispatch({ type: "SET_MAX_PARTICIPANTS", payload: val as number })
          }
        />
        <Button onClick={handleRoomCreation}>Create</Button>
      </Stack>
    </Modal>
  );
});
