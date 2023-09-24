import { Row } from "@/components/Layout";
import Logo from "./Logo";
import User from "./User";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Row>
        <div className={styles.headerLayout}>
          <Logo />
          <User />
        </div>
      </Row>
    </header>
  );
}
