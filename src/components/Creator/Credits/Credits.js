import Image from "next/image";
import styles from "./Credits.module.css";

export default function Credits() {
  return (
    <div className={styles.credits}>
      <Image
        src="/images/api_logo_pwrdBy_strava_horiz_white.svg"
        height={20}
        width={107.1375}
        alt="Powered by Strava"
      />
    </div>
  );
}
