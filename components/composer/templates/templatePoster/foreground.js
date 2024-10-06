import { Box, Flex, Text } from "@radix-ui/themes";

import styles from "./foreground.module.css";

const Foreground = ({
  name,
  type,
  day,
  year,
  distance,
  elevation,
  width,
  height,
  color,
}) => {
  // 40px / 1080px
  const fontSize = width * 0.037;
  const padding = width * 0.037;
  return (
    <Box
      className={styles.foreground}
      style={{ fontSize: fontSize, color: color }}
    >
      <Flex
        className={styles.typeTop}
        style={{ left: padding, right: padding, top: padding }}
      >
        <Box className={styles.typeLeft} style={{ maxWidth: "66%" }}>
          <TypePrimary>{name}</TypePrimary>
          <TypeSecondary>{type}</TypeSecondary>
        </Box>
        <Box className={styles.typeRight} style={{ maxWidth: "66%" }}>
          <TypePrimary>{day}</TypePrimary>
          <TypeSecondary>{year}</TypeSecondary>
        </Box>
      </Flex>
      <Flex
        className={styles.typeBottom}
        style={{ left: padding, right: padding, bottom: padding }}
      >
        <Box className={styles.typeLeft} style={{ maxWidth: "66%" }}>
          <TypePrimary>State</TypePrimary>
          <TypeSecondary>Country</TypeSecondary>
        </Box>
        <Box className={styles.typeRight} style={{ maxWidth: "66%" }}>
          <TypePrimary>{distance}</TypePrimary>
          <TypeSecondary>{elevation}</TypeSecondary>
        </Box>
      </Flex>
    </Box>
  );
};

const TypePrimary = ({ children }) => (
  <Text className={styles.typePrimary} style={{ color: "#fff" }}>
    {children}
  </Text>
);

const TypeSecondary = ({ children }) => (
  <Text className={styles.typeSecondary}>{children}</Text>
);

export default Foreground;
