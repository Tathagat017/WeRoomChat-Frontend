import {
  Button,
  Container,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginBackGroundImage from "../assets/images/login-background.png";
import { SideImageRenderer } from "../components/side-image-renderer";
import { useStore } from "../hooks/use-store";
import { useStyles } from "../styles/login-styles";
import { notifications } from "@mantine/notifications";
import { IconUser } from "@tabler/icons-react";

const Login = observer(function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { authStore: apiStore } = useStore();
  const navigate = useNavigate();
  const { classes } = useStyles();

  const handleLogin = async () => {
    if (!validateInputs()) return;

    const result = await apiStore.loginUser({ email, password });
    if (result) navigate("/dashboard");
    notifications.show({
      title: "Login successful",
      withCloseButton: true,
      icon: <IconUser />,
      message: "You have successfully logged in",
    });
  };

  const validateInputs = () => {
    let isValid = true;

    // Email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(null);
    }

    // Password
    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else {
      setPasswordError(null);
    }

    return isValid;
  };

  return (
    <div className={classes.loginContainer}>
      <div className={classes.sideImage}>
        <SideImageRenderer image={LoginBackGroundImage} />
      </div>
      <Container className={classes.formContainer}>
        <Title order={2} align="center">
          Login
        </Title>
        <Stack mt="md">
          <TextInput
            label="User name"
            placeholder="User name"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            onBlur={() => {
              if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                setEmailError("Please enter a valid email address.");
              } else {
                setEmailError(null);
              }
            }}
            error={emailError}
          />
          <PasswordInput
            placeholder="Password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            onBlur={() => {
              if (!password || password.length < 6) {
                setPasswordError("Password must be at least 6 characters.");
              } else {
                setPasswordError(null);
              }
            }}
            error={passwordError}
            description="Password must include at least one letter, number and special character"
            withAsterisk
          />

          <Text size="sm" align="right" mt={-8}>
            Not registered?{" "}
            <Text
              span
              c="blue"
              fw={500}
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Register here
            </Text>
          </Text>
          <Button mt="sm" onClick={handleLogin} fullWidth>
            Login
          </Button>
        </Stack>
      </Container>
    </div>
  );
});

export default Login;
