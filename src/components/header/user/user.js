"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Popover,
  SegmentedControl,
  Separator,
  Text,
} from "@radix-ui/themes";
import { useTheme } from "next-themes";

import { signOutAction } from "@/app/actions";

import styles from "./user.module.css";

// Function that returns the initials of a user name
const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("");

export default function User({ user }) {
  const { theme, setTheme } = useTheme();
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Avatar src={user.image} fallback={getInitials(user.name)} size={"2"} />
      </Popover.Trigger>
      <Popover.Content width="300px">
        <Box>
          <Heading as="h3" size="3">
            Signed in as:
          </Heading>
          <Text as="p" className={styles.userName}>
            {user.name}
          </Text>
          <Text as="p">
            <Link href={"https://strava.com"} target="blank">
              Go to Strava profile
            </Link>
          </Text>
        </Box>
        <Separator my="3" size="4" />
        <SegmentedControl.Root
          onValueChange={(value) => setTheme(value)}
          defaultValue={theme}
          className={styles.userSegmentedControl}
        >
          <SegmentedControl.Item value="light">
            <Flex align={"center"} gap={"1"}>
              <SunIcon />
              Light
            </Flex>
          </SegmentedControl.Item>
          <SegmentedControl.Item value="dark">
            <Flex align={"center"} gap={"1"}>
              <MoonIcon />
              Dark
            </Flex>
          </SegmentedControl.Item>
        </SegmentedControl.Root>
        <Separator my="3" size="4" />
        <form action={signOutAction}>
          <Button type="submit" color="red" className={styles.userAction}>
            Sign out
          </Button>
        </form>
      </Popover.Content>
    </Popover.Root>
  );
}
