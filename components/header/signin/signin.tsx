import { signIn } from "@/auth";
import Image from "next/image";
import styles from "./signin.module.css";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("strava", { redirectTo: "/composer" });
      }}
    >
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
