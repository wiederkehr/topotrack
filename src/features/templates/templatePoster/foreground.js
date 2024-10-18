import { ArrowRightIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { Box, Flex, Text } from "@radix-ui/themes";

import styles from "./foreground.module.css";

const Foreground = ({
  name,
  type,
  day,
  year,
  distance,
  elevation,
  state,
  country,
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
          <TypePrimary>{state}</TypePrimary>
          <TypeSecondary>{country}</TypeSecondary>
        </Box>
        <Box className={styles.typeRight} style={{ maxWidth: "66%" }}>
          <Flex justify={"end"}>
            <TypePrimary>{distance}</TypePrimary>
            <ArrowRightIcon height={fontSize} width={fontSize} />
          </Flex>
          <Flex justify={"end"}>
            <TypePrimary>{elevation}</TypePrimary>
            <ArrowUpIcon height={fontSize} width={fontSize} />
          </Flex>
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
