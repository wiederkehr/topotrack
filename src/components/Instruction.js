import styles from "./Instruction.module.css";

export default function Instruction() {
  return (
    <div className={styles.instruction}>
      <p className={styles.instructionText}>
        Hey, please sign in with Strava to get started.
      </p>
    </div>
  );
}
