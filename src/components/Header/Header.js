import Row from "@/components/layout/row";
import Logo from "./logo";
import User from "./user";
import styles from "./header.module.css";

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
