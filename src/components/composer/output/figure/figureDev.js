import styles from "./figureDev.module.css";

export default function FigureDev(props) {
  return (
    <div className={styles.figure}>
      <pre>
        <code>{JSON.stringify(props, null, 2)}</code>
      </pre>
    </div>
  );
}
