import { Flex } from "@radix-ui/themes";
import Row from "@/components/layout/row";
import Logo from "./logo";
import User from "./user";
import styles from "./header.module.css";

export default function Header({ dev }) {
  return (
    <header className={styles.header}>
      <Row>
        <Flex direction="row" justify="between" align="center">
          <Logo />
          <User dev={dev} />
        </Flex>
      </Row>
    </header>
  );
}
