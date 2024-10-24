import { Flex } from "@radix-ui/themes";

import Row from "@/components/layout/row";

import styles from "./header.module.css";
import Logo from "./logo";
import SignIn from "./signin";
import User from "./user";
import { UserType } from "./user";

type HeaderProps = {
  user: UserType | null;
};

async function Header({ user }: HeaderProps) {
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

export default Header;
