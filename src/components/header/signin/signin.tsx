import Form from "next/form";
import Image from "next/image";

import { signInAction } from "@/app/actions";

import styles from "./signin.module.css";

function SignIn() {
  const handleSignIn = async () => {
    await signInAction();
  };
  return (
    <Form action={handleSignIn}>
      <button type="submit" className={styles.signinButton}>
        <Image
          src="/images/btn_strava_connectwith_orange.svg"
          height={48}
          width={193}
          priority
          alt="Connect with Strava"
        />
      </button>
    </Form>
  );
}

export default SignIn;
