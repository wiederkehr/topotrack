"use client";
import { signOut } from "next-auth/react";
import styles from "./userSignedIn.module.css";

export default function UserSignedIn({ user }) {
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
        <button className={styles.userAction} onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    </div>
  );
}
