import Container from "@/components/Container";
import Logo from "@/components/Logo";
import Connection from "@/components/Connection";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.headerLayout}>
          <Logo />
          <Connection />
        </div>
      </Container>
    </header>
  );
}
