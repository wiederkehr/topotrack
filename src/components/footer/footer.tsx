import { Flex } from "@radix-ui/themes";

import Row from "@/components/layout/row";

import CopyrightBy from "./copyrightBy";
import styles from "./footer.module.css";
import PoweredBy from "./poweredBy";

function Footer() {
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

export default Footer;
