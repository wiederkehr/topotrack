import Container from "@/components/Container";
import Logo from "./Logo";
import User from "./User";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.headerLayout}>
          <Logo />
          <User />
        </div>
      </Container>
    </header>
  );
}
