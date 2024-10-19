import { ArrowRightIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { Box, Flex, Text } from "@radix-ui/themes";

import styles from "./type.module.css";

const TypePrimary = ({ children, style }) => (
  <Text className={styles.typePrimary} style={style}>
    {children}
  </Text>
);

const TypeSecondary = ({ children, style }) => (
  <Text className={styles.typeSecondary} style={style}>
    {children}
  </Text>
);

const TypeGrid = ({
  name,
  type,
  day,
  year,
  distance,
  elevation,
  state,
  country,
  width,
  contrast,
  accent,
}) => {
  const factor = 40 / 1080;
  const fontSize = width * factor;
  const padding = width * factor;
  return (
    <Box className={styles.typeGrid} style={{ fontSize: fontSize }}>
      <Flex
        className={styles.typeTop}
        style={{ left: padding, right: padding, top: padding }}
      >
        <Box className={styles.typeLeft} style={{ maxWidth: "66%" }}>
          <TypePrimary style={{ color: contrast }}>{name}</TypePrimary>
          <TypeSecondary style={{ color: accent }}>{type}</TypeSecondary>
        </Box>
        <Box className={styles.typeRight} style={{ maxWidth: "66%" }}>
          <TypePrimary style={{ color: contrast }}>{day}</TypePrimary>
          <TypeSecondary style={{ color: accent }}>{year}</TypeSecondary>
        </Box>
      </Flex>
      <Flex
        className={styles.typeBottom}
        style={{ left: padding, right: padding, bottom: padding }}
      >
        <Box className={styles.typeLeft} style={{ maxWidth: "66%" }}>
          <TypePrimary style={{ color: contrast }}>{state}</TypePrimary>
          <TypeSecondary style={{ color: accent }}>{country}</TypeSecondary>
        </Box>
        <Box className={styles.typeRight} style={{ maxWidth: "66%" }}>
          <Flex justify={"end"}>
            <TypePrimary style={{ color: contrast }}>{distance}</TypePrimary>
            <ArrowRightIcon
              height={fontSize}
              width={fontSize}
              style={{ color: accent }}
            />
          </Flex>
          <Flex justify={"end"}>
            <TypePrimary style={{ color: contrast }}>{elevation}</TypePrimary>
            <ArrowUpIcon
              height={fontSize}
              width={fontSize}
              style={{ color: accent }}
            />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export { TypeGrid, TypePrimary, TypeSecondary };
