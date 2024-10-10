import { Flex } from "@radix-ui/themes";

import Row from "@/components/layout/row";

import styles from "./header.module.css";
import Logo from "./logo";
import SignIn from "./signin";
import User from "./user";

export default async function Header({ user }) {
  return (
    <header className={styles.header}>
      <Row>
        <Flex direction="row" justify="between" align="center">
          <Logo />
          {user && <User user={user} />}
          {!user && <SignIn />}
        </Flex>
      </Row>
    </header>
  );
}
