import { Anchor, Box, Container, Flex, Group, Text, rem } from "@mantine/core";
import { IconBrandLinkedin, IconWorld } from "@tabler/icons-react";

export const Footer = () => {
  return (
    <footer
      style={{
        borderTop: "1px solid #eaeaea",
        padding: "1rem 0",
        marginTop: "auto",
        background: "#f8f9fa",
        width: "100%",
        boxShadow: "0 -2px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container size="lg" px="md">
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "flex-start", sm: "center" }}
          gap={{ base: "md", sm: 0 }}
        >
          <Box>
            <Text fw={700} size="md">
              myLogo
            </Text>
            <Text size="sm" c="dimmed">
              Built by TATHAGAT © 2025
            </Text>
          </Box>

          <Group spacing="xs">
            <Anchor
              href="https://www.linkedin.com/in/your-linkedin-id"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
            >
              <IconBrandLinkedin size={rem(20)} />
            </Anchor>
            <Anchor
              href="https://your-portfolio.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Portfolio"
            >
              <IconWorld size={rem(20)} />
            </Anchor>
          </Group>
        </Flex>
      </Container>
    </footer>
  );
};
