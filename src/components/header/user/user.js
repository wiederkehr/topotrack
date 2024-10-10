import { signOutAction } from "@/app/actions";

import styles from "./user.module.css";

export default function User({ user }) {
  return (
    <div className={styles.user}>
      <div className={styles.userProfile}>
        <div
          className={styles.userImage}
          style={{ backgroundImage: `url(${user.image})` }}
        ></div>
      </div>
      <div className={styles.userMenu}>
        <p className={styles.userInfo}>
          <span className={styles.userNameLabel}>Signed in as:</span>
          <span className={styles.userName}>{user.name}</span>
        </p>
        <a href={"https://strava.com"} className={styles.userAction}>
          Go to Strava
        </a>
        <form action={signOutAction}>
          <button type="submit" className={styles.userAction}>
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}