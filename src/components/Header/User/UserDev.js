import styles from "./UserSignedIn.module.css";

export default function UserDev() {
  return (
    <div className={styles.user}>
      <div className={styles.userProfile}>
        <div className={styles.userAvatar}></div>
      </div>
    </div>
  );
}
