import { Container, Title, Text, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>Welcome to Misogi</Title>
      <Text>Plan your adventures effortlessly!</Text>
      <Button mt="md" onClick={() => navigate("/login")}>
        Get Started
      </Button>
    </Container>
  );
};

export default LandingPage;
