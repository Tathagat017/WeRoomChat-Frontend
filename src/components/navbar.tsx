import {
  Avatar,
  Burger,
  Button,
  Container,
  createStyles,
  Drawer,
  Group,
  Indicator,
  Menu,
  Stack,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoImage from "../assets/images/loop_logo.png";
import { useStore } from "../hooks/use-store";

const links = [
  { label: "Chat Rooms", href: "/rooms" },
  { label: "Create Room", href: "/createRoom" },
];

const useStyles = createStyles((theme) => ({
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100vw",
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: `linear-gradient(
      to right,
      ${theme.fn.rgba(theme.colors.indigo[2], 0.8)} 0%,
      ${theme.fn.rgba(theme.colors.indigo[1], 0.8)} 30%,
      ${theme.fn.rgba(theme.colors.indigo[0], 0.8)} 100%
    )`,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: `1px solid ${theme.fn.rgba(theme.colors.indigo[9], 0.2)}`,
    boxShadow: theme.shadows.md,
    color: theme.white,
  },
  // ... rest of your styles
}));

export const NavBar = observer(function NavBar() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState("Home");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { classes } = useStyles();
  const { authStore: apiStore, uiViewStore } = useStore();
  const navigate = useNavigate();
  const isLoggedIn = apiStore.IsAuthenticated;

  const linksToShow = isLoggedIn
    ? links
    : links.filter((l) => l.label !== "Create Room");

  const items = linksToShow.map((link) => (
    <Button
      key={link.label}
      variant="subtle"
      color={active === link.label ? "blue" : "gray"}
      onClick={() => {
        setActive(link.label);
        close();
        if (link.label === "Create Room") {
          uiViewStore.CreateRoomModalOpen = true;
        } else {
          navigate(link.href);
        }
      }}
      component="a"
    >
      {link.label}
    </Button>
  ));

  useEffect(() => {
    console.log(apiStore.socketStore.Notification); // Check if notifications are being updated
  }, [apiStore.socketStore.Notification]);

  return (
    <Container fluid px="md" py="sm" className={classes.navbar}>
      {/* Logo */}
      <img
        src={LogoImage}
        alt="Logo"
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          marginRight: "10px",
        }}
      ></img>

      {/* Desktop nav */}
      {!isMobile && (
        <Group spacing="md">
          {items}
          <AvatarPopover isLoggedIn={isLoggedIn} />
        </Group>
      )}

      {/* Mobile burger + drawer */}
      {isMobile && (
        <>
          {!opened && <Burger opened={false} onClick={toggle} />}
          <Drawer
            opened={opened}
            onClose={close}
            title="Navigation"
            padding="md"
            size="xs"
          >
            <Stack spacing="md" align="center">
              <Avatar color="blue" radius="xl">
                T
              </Avatar>
              {items}
            </Stack>
          </Drawer>
        </>
      )}
    </Container>
  );
});

const AvatarPopover = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const navigate = useNavigate();
  const { authStore } = useStore();
  const handleLogOut = async () => {
    await authStore.logout();
    navigate("/");
  };

  return (
    <Menu width={150} withArrow>
      <Menu.Target>
        <Group spacing="md">
          <NavAvatar />
        </Group>
      </Menu.Target>
      <Menu.Dropdown>
        <Stack>
          {isLoggedIn && (
            <Button
              fullWidth
              variant="subtle"
              onClick={() => navigate("/invitations")}
            >
              {"Invitations"}
            </Button>
          )}
          {isLoggedIn ? (
            <Button fullWidth variant="subtle" onClick={handleLogOut}>
              {"Logout"}
            </Button>
          ) : (
            <Button
              fullWidth
              variant="subtle"
              onClick={() => navigate("/login")}
            >
              {"Login"}
            </Button>
          )}
          {!isLoggedIn && (
            <Button
              fullWidth
              variant="subtle"
              onClick={() => navigate("/register")}
            >
              {"Register"}
            </Button>
          )}
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
};

const NavAvatar = observer(function NavAvatar() {
  const { authStore } = useStore();
  const notificationsCount = authStore.socketStore.notifications.length;
  return (
    <Indicator
      size={8}
      offset={3}
      disabled={notificationsCount === 0}
      color="red"
      label={notificationsCount > 0 ? notificationsCount.toString() : ""}
    >
      <Avatar radius="xl" />
    </Indicator>
  );
});
