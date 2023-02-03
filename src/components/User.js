import { useSession, signOut } from "next-auth/react";
import styles from "./User.module.css";

export default function User() {
  const { data: session } = useSession();
  const picture = session.user.picture;
  console.log(picture);
  return (
    <div className={styles.user}>
      <div className={styles.userProfile}>
        <div
          className={styles.userAvatar}
          style={{ backgroundImage: `url(${picture})` }}
        ></div>
      </div>
      <div className={styles.userActions}>
        <button className={styles.userAction} onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    </div>
  );
}
