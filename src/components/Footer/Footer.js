import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Container from "@/components/Container";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        Made with{" "}
        <FontAwesomeIcon icon={faHeart} className={styles.footerHeartIcon} /> by
        Benji
      </Container>
    </footer>
  );
}
