import { Row } from "@/components/Layout";
import styles from "./Content.module.css";

export default function Content({ children }) {
  return (
    <main className={styles.content}>
      <Row>{children}</Row>
    </main>
  );
}
