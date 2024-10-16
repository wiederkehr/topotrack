import { Flex, Separator } from "@radix-ui/themes";

import Row from "@/components/layout/row";

import CopyrightBy from "./copyrightBy";
import styles from "./footer.module.css";
import PoweredBy from "./poweredBy";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Row>
        <Flex
          direction={{ initial: "column", sm: "row" }}
          gap={{ initial: "2" }}
          justify="between"
          align="center"
        >
          <CopyrightBy />
          <PoweredBy />
        </Flex>
      </Row>
    </footer>
  );
}
