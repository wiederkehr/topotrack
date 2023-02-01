import Container from "@/components/Container";
import styles from "./Content.module.css";

export default function Content({ children }) {
  return (
    <main className={styles.content}>
      <Container>{children}</Container>
    </main>
  );
}
