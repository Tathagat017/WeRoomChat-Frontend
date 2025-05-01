import { Container, Image } from "@mantine/core";

export const SideImageRenderer = ({ image }: { image: string }) => {
  return (
    <Container
      w={{ base: "100%", md: "50%" }}
      h="auto"
      p={0}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        src={image}
        w={{ base: "80%", md: "60%" }}
        h="auto"
        style={{ objectFit: "contain" }}
      />
    </Container>
  );
};
