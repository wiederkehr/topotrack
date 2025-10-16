import { Flex } from "@radix-ui/themes";
import type { User as UserType } from "next-auth";

import { Row } from "@/components/layout/row";

import styles from "./header.module.css";
import { Logo } from "./logo";
import { SignIn } from "./signin";
import { User } from "./user";

type HeaderProps = {
  user: UserType | null;
};

export function Header({ user }: HeaderProps) {
  return (
    <header className={styles.header}>
      <Row>
        <Flex direction="row" justify="between" align="center">
          <Logo />
          {user ? <User user={user} /> : <SignIn />}
        </Flex>
      </Row>
    </header>
  );
}
