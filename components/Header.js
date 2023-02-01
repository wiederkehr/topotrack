import Container from "@/components/Container";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Container>
        <h1>Topotrack</h1>
      </Container>
    </header>
  );
}
