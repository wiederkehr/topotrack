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
import Form from "next/form";
import type { User as UserType } from "next-auth";
import { useTheme } from "next-themes";

import { signOutAction } from "@/app/actions";
import { formatInitials } from "@/functions/format";

import styles from "./user.module.css";

type UserProps = { user: UserType };

function User({ user }: UserProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Avatar
          src={user.image ?? undefined}
          fallback={formatInitials(user.name ?? "")}
          size={"2"}
        />
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
        <Separator my="4" size="4" />
        <Flex direction="column" gap="2">
          <Heading as="h3" size="3">
            Settings
          </Heading>
          <Flex direction="column" gap="2">
            <Heading as="h3" size="2">
              Theme
            </Heading>
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
          </Flex>
        </Flex>
        <Separator my="4" size="4" />
        <Form action={() => void signOutAction()}>
          <Button type="submit" color="red" className={styles.userAction}>
            Sign out
          </Button>
        </Form>
      </Popover.Content>
    </Popover.Root>
  );
}

export default User;
