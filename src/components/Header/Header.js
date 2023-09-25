import { Row } from "@/components/Layout";
import Logo from "./Logo";
import User from "./User";
import styles from "./Header.module.css";

export default function Header({ dev }) {
  return (
    <header className={styles.header}>
      <Row>
        <div className={styles.headerLayout}>
          <Logo />
          <User dev={dev} />
        </div>
      </Row>
    </header>
  );
}
