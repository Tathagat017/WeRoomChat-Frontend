import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  loginContainer: {
    display: "flex",
    flexDirection: "row",
    height: "calc(100vh - 150px)",
    width: "100%",
    background: `linear-gradient(to left, ${theme.colors.indigo[1]}, ${theme.colors.indigo[4]})`,
    boxShadow: theme.shadows.lg,
    overflow: "hiddne",
    [theme.fn.smallerThan("md")]: {
      flexDirection: "column",
    },
  },

  formContainer: {
    flex: 1,
    padding: theme.spacing.xl,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 500,
    margin: "auto",

    backdropFilter: "blur(10px)",
    background: "rgba(255, 255, 255, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    borderRadius: theme.radius.sm,
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",

    [theme.fn.smallerThan("md")]: {
      width: "100%",
      maxWidth: "100%",
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      background: "rgba(255, 255, 255, 0.15)",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)", // softer shadow
      border: "1px solid rgba(255, 255, 255, 0.15)",
    },

    [theme.fn.smallerThan("sm")]: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      boxShadow: "none", // very minimal for mobile
      background: "rgba(255, 255, 255, 0.12)",
    },
  },

  sideImage: {
    flex: 0.5,
    display: "block",
    margin: "auto",
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },
}));
