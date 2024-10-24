import { Text } from "@radix-ui/themes";
import Link from "next/link";

import styles from "./copyrightBy.module.css";

function Credits() {
  return (
    <div className={styles.copyrightBy}>
      <Text>
        {"© "}
        <Link href="https://benjaminwiederkehr.com" target="_blank">
          Benjamin Wiederkehr
        </Link>
      </Text>
    </div>
  );
}

export default Credits;
