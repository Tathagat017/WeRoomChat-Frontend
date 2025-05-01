import {
  Button,
  Container,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import RegisterSideBarImage from "../assets/images/register-image.png";
import { PasswordWithValidation } from "../components/password-with-validation";
import { SideImageRenderer } from "../components/side-image-renderer";
import { useStore } from "../hooks/use-store";
import { useStyles } from "../styles/login-styles";

// Define the initial state type
interface RegisterState {
  fullName: string;
  email: string;
  password: string;
  error: string;
  emailError: string | null;
  nameError: string | null;
  passwordError: string | null;
}

// Define action types and payloads
type Action =
  | { type: "SET_FIELD"; field: keyof RegisterState; value: string }
  | { type: "SET_ERROR"; value: string }
  | { type: "SET_EMAIL_ERROR"; value: string | null }
  | { type: "SET_NAME_ERROR"; value: string | null }
  | { type: "SET_PASSWORD_ERROR"; value: string | null };

// Initial state object
const initialState: RegisterState = {
  fullName: "",
  email: "",
  password: "",
  error: "",
  emailError: null,
  nameError: null,
  passwordError: null,
};

// Reducer function to manage state
function formReducer(state: RegisterState, action: Action): RegisterState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ERROR":
      return { ...state, error: action.value };
    case "SET_EMAIL_ERROR":
      return { ...state, emailError: action.value };
    case "SET_NAME_ERROR":
      return { ...state, nameError: action.value };
    case "SET_PASSWORD_ERROR":
      return { ...state, passwordError: action.value };
    default:
      return state;
  }
}

const RegisterPage = () => {
  const { authStore: apiStore } = useStore();
  const navigate = useNavigate();
  const { classes } = useStyles();
  // Use useReducer for managing form and error states
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleRegister = async () => {
    dispatch({ type: "SET_ERROR", value: "" });

    // Input validation
    let isValid = true;
    if (state.fullName.trim().length < 3) {
      dispatch({
        type: "SET_NAME_ERROR",
        value: "Full name must be at least 3 characters",
      });
      isValid = false;
    } else {
      dispatch({ type: "SET_NAME_ERROR", value: null });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      dispatch({ type: "SET_EMAIL_ERROR", value: "Invalid email address" });
      isValid = false;
    } else {
      dispatch({ type: "SET_EMAIL_ERROR", value: null });
    }

    if (state.password.length < 8) {
      dispatch({
        type: "SET_PASSWORD_ERROR",
        value: "Password must be at least 8 characters long",
      });
      isValid = false;
    } else {
      dispatch({ type: "SET_PASSWORD_ERROR", value: null });
    }

    if (!isValid) return;

    const result = await apiStore.signUp({
      full_name: state.fullName,
      email: state.email,
      password: state.password,
    });

    if (result) {
      navigate("/login");
    } else {
      dispatch({
        type: "SET_ERROR",
        value: "Registration failed. Please try again.",
      });
    }
  };

  return (
    <div className={classes.loginContainer}>
      <div className={classes.sideImage}>
        <SideImageRenderer image={RegisterSideBarImage} />
      </div>
      <Container className={classes.formContainer}>
        <Title order={2} align="center" mb="md">
          Create an Account
        </Title>
        <Stack>
          <TextInput
            label="Full Name"
            placeholder="Name"
            value={state.fullName}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "fullName",
                value: e.currentTarget.value,
              })
            }
            onBlur={() => {
              if (state.fullName.trim().length < 3) {
                dispatch({
                  type: "SET_NAME_ERROR",
                  value: "Full name must be at least 3 characters",
                });
              } else {
                dispatch({ type: "SET_NAME_ERROR", value: null });
              }
            }}
            error={state.nameError}
            required
          />

          <TextInput
            label="Email"
            placeholder="email"
            type="email"
            value={state.email}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "email",
                value: e.currentTarget.value,
              })
            }
            onBlur={() => {
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
                dispatch({
                  type: "SET_EMAIL_ERROR",
                  value: "Invalid email address",
                });
              } else {
                dispatch({ type: "SET_EMAIL_ERROR", value: null });
              }
            }}
            error={state.emailError}
            required
          />

          <PasswordWithValidation
            password={state.password}
            setPassword={(value) =>
              dispatch({ type: "SET_FIELD", field: "password", value })
            }
            error={state.passwordError}
            onBlur={() => {
              if (state.password.length < 8) {
                dispatch({
                  type: "SET_PASSWORD_ERROR",
                  value: "Password must be at least 8 characters",
                });
              } else {
                dispatch({ type: "SET_PASSWORD_ERROR", value: null });
              }
            }}
          />

          {state.error && (
            <Text color="red" size="sm">
              {state.error}
            </Text>
          )}

          <Button fullWidth mt="md" onClick={handleRegister}>
            Register
          </Button>
        </Stack>
      </Container>
    </div>
  );
};

export default RegisterPage;
