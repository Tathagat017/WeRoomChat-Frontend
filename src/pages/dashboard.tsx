import { Button, Container, Title } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useStore } from "../hooks/use-store";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconLogout2 } from "@tabler/icons-react";
const Dashboard = observer(() => {
  const { authStore: apiStore } = useStore();
  const navigate = useNavigate();
  return (
    <Container mt="xl">
      <Title order={2}>Welcome, {apiStore.user?.full_name}</Title>
      <Button
        color="red"
        mt="lg"
        onClick={() => {
          apiStore.logout();
          navigate("/");
          notifications.show({
            title: "Logout successful",
            withCloseButton: true,
            icon: <IconLogout2 />,
            message: "You have successfully logged out",
          });
        }}
      >
        Logout
      </Button>
    </Container>
  );
});

export default Dashboard;
