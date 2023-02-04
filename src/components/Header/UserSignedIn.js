import { useSession, signOut } from "next-auth/react";
import styles from "./UserSignedIn.module.css";

export default function UserSignedIn() {
  const { data: session } = useSession();
  const picture = session.user.picture;
  return (
    <div className={styles.user}>
      <div className={styles.userProfile}>
        <div
          className={styles.userAvatar}
          style={{ backgroundImage: `url(${picture})` }}
        ></div>
      </div>
      <div className={styles.userMenu}>
        <p className={styles.userInfo}>
          <span className={styles.userNameLabel}>Signed in as:</span>
          <span className={styles.userName}>{session.user.name}</span>
        </p>
        <a href={"https://strava.com"} className={styles.userAction}>
          Go to Strava
        </a>
        <button className={styles.userAction} onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    </div>
  );
}
