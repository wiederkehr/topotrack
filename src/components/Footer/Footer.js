import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Container from "@/components/Container";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.footerGrid}>
          <div className={styles.footerGridLeft}>
            Made with{" "}
            <FontAwesomeIcon
              icon={faHeart}
              className={styles.footerHeartIcon}
            />{" "}
            by{" "}
            <Link href="https://benjaminwiederkehr.com">
              {" "}
              Benjamin Wiederkehr
            </Link>
          </div>
          <div className={styles.footerGridRight}>
            <Image
              src="/images/api_logo_pwrdBy_strava_horiz_gray.svg"
              height={32}
              width={171.42}
              alt="Powered by Strava"
            />
          </div>
        </div>
      </Container>
    </footer>
  );
}
