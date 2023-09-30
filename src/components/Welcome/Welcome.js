import styles from "./welcome.module.css";

export default function Welcome() {
  return (
    <div className={styles.welcome}>
      <p className={styles.welcomeText}>
        Hey, please sign in with Strava to get started.
      </p>
    </div>
  );
}
