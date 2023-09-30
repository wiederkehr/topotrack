import Row from "@/components/layout/row";
import styles from "./content.module.css";

export default function Content({ children }) {
  return (
    <main className={styles.content}>
      <Row>{children}</Row>
    </main>
  );
}
