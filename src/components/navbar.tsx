import {
  Avatar,
  Burger,
  Button,
  Container,
  createStyles,
  Drawer,
  Group,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../hooks/use-store";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
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
  const { authStore: apiStore } = useStore();
  const isLoggedIn = apiStore.isAuthenticated;

  const items = links.map((link) => (
    <Button
      key={link.label}
      variant="subtle"
      color={active === link.label ? "blue" : "gray"}
      onClick={() => {
        setActive(link.label);
        close();
      }}
      component="a"
      href={link.href}
    >
      {link.label}
    </Button>
  ));

  return (
    <Container fluid px="md" py="sm" className={classes.navbar}>
      {/* Logo */}
      <Text fw={700} size="xl">
        MyLogo
      </Text>

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

  return (
    <Menu width={150} withArrow>
      <Menu.Target>
        <Group spacing="md">
          <Avatar color="blue" radius="xl"></Avatar>
        </Group>
      </Menu.Target>
      <Menu.Dropdown>
        <Stack>
          {isLoggedIn ? (
            <Button fullWidth variant="subtle">
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
