import Image from "next/image";
import { signIn } from "next-auth/react";
import styles from "./userSignedOut.module.css";

export default function UserSignedOut() {
  return (
    <button className={styles.action} onClick={() => signIn("strava")}>
      <Image
        src="/images/btn_strava_connectwith_orange.svg"
        height={48}
        width={193}
        alt="Connect with Strava"
      />
    </button>
  );
}
