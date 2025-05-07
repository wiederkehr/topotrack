import { ArrowRightIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { Box, Flex, Text } from "@radix-ui/themes";
import { CSSProperties, ReactNode } from "react";

import { FormatType } from "@/types";

import styles from "./type.module.css";

type TypePrimaryProps = {
  children: ReactNode;
  style?: CSSProperties;
};

function TypePrimary({ children, style }: TypePrimaryProps) {
  return (
    <Text className={styles.typePrimary} style={style}>
      {children}
    </Text>
  );
}

type TypeSecondaryProps = {
  children: ReactNode;
  style?: CSSProperties;
};

function TypeSecondary({ children, style }: TypeSecondaryProps) {
  return (
    <Text className={styles.typeSecondary} style={style}>
      {children}
    </Text>
  );
}

type TypeGridProps = {
  accent: string;
  contrast: string;
  country: string;
  day: string;
  distance: string;
  elevation: string;
  format: FormatType;
  name: string;
  state: string;
  type: string;
  width: number;
  year: string;
};

function TypeGrid({
  name,
  type,
  day,
  year,
  distance,
  elevation,
  state,
  country,
  width,
  format,
  contrast,
  accent,
}: TypeGridProps) {
  const factor = width / format.width;
  const defaultFontSize = 40;
  const fontSize = defaultFontSize * factor;
  const defaultPadding = 40;
  const storyVerticalPadding = 250;
  const padding = {
    top: format.name === "Story" ? storyVerticalPadding : defaultPadding,
    bottom: format.name === "Story" ? storyVerticalPadding : defaultPadding,
    left: defaultPadding,
    right: defaultPadding,
  };
  const bottom = padding.bottom * factor;
  const left = padding.left * factor;
  const right = padding.right * factor;
  const top = padding.top * factor;

  return (
    <Box className={styles.typeGrid} style={{ fontSize: fontSize }}>
      <Flex className={styles.typeTop} style={{ left, right, top }}>
        <Box className={styles.typeLeft} style={{ maxWidth: "66%" }}>
          <TypePrimary style={{ color: contrast }}>{name}</TypePrimary>
          <TypeSecondary style={{ color: accent }}>{type}</TypeSecondary>
        </Box>
        <Box className={styles.typeRight} style={{ maxWidth: "66%" }}>
          <TypePrimary style={{ color: contrast }}>{day}</TypePrimary>
          <TypeSecondary style={{ color: accent }}>{year}</TypeSecondary>
        </Box>
      </Flex>
      <Flex className={styles.typeBottom} style={{ left, right, bottom }}>
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
}

export { TypeGrid, TypePrimary, TypeSecondary };
