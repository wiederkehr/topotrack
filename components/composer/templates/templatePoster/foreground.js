import { Box, Flex, Text } from "@radix-ui/themes";

import { colors } from "@/styles/constants";

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
}) => {
  const fontSize = width / 40;
  return (
    <Box className={styles.foreground} style={{ fontSize: fontSize }}>
      <Flex className={styles.typeTop}>
        <Box className={styles.typeLeft}>
          <TypePrimary>{name}</TypePrimary>
          <TypeSecondary>{type}</TypeSecondary>
        </Box>
        <Box className={styles.typeRight}>
          <TypePrimary>{day}</TypePrimary>
          <TypeSecondary>{year}</TypeSecondary>
        </Box>
      </Flex>
      <Flex className={styles.typeBottom}>
        <Box className={styles.typeLeft}>
          <TypePrimary>State</TypePrimary>
          <TypeSecondary>Country</TypeSecondary>
        </Box>
        <Box className={styles.typeRight}>
          <TypePrimary>{distance}</TypePrimary>
          <TypeSecondary>{elevation}</TypeSecondary>
        </Box>
      </Flex>
    </Box>
  );
};

const TypePrimary = ({ children }) => (
  <Text className={styles.typePrimary}>{children}</Text>
);

const TypeSecondary = ({ children }) => (
  <Text className={styles.typeSecondary}>{children}</Text>
);

export default Foreground;
