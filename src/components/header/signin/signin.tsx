import Image from "next/image";

import { signInAction } from "@/app/actions";

import styles from "./signin.module.css";

function SignIn() {
  return (
    <form action={signInAction}>
      <button type="submit" className={styles.signinButton}>
        <Image
          src="/images/btn_strava_connectwith_orange.svg"
          height={48}
          width={193}
          alt="Connect with Strava"
        />
      </button>
    </form>
  );
}

export default SignIn;
