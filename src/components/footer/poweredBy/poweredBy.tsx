import Image from "next/image";

import styles from "./poweredBy.module.css";

export function PoweredBy() {
  return (
    <Image
      src="/images/api_logo_pwrdBy_strava_horiz_gray.svg"
      height={16}
      width={140}
      alt="Powered by Strava"
      className={styles.poweredBy}
    />
  );
}
