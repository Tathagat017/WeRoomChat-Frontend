import { Button, Container, Flex, Image, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import LogoImage from "../assets/images/loop_logo.png"; // Adjust the path to your logo image
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Flex mb="xl" direction="column" align="center">
        <Image
          src={LogoImage} // Replace with your logo or an image
          alt="RoomLoop Logo"
          width={200}
          mb="md"
        />
        <Title order={1} style={{ fontWeight: 700, fontSize: "36px" }}>
          Welcome to RoomLoop
        </Title>
        <Text size="lg" color="dimmed" mt="sm">
          Discover and join live events and micro-meetups effortlessly.
        </Text>
      </Flex>
      <Button
        size="lg"
        onClick={() => navigate("/login")}
        style={{
          backgroundColor: "#4CAF50", // Green for a fresh look
          padding: "12px 24px",
          fontSize: "18px",
          fontWeight: 600,
        }}
      >
        Start Chatting
      </Button>
    </Container>
  );
};

export default LandingPage;
