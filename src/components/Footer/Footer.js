import Image from "next/image";
import Link from "next/link";
import Row from "@/components/layout/row";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Row>
        <div className={styles.footerGrid}>
          <div className={styles.footerGridLeft}>
            <div className={styles.copyright}>
              {"© "}
              <Link href="https://benjaminwiederkehr.com" target="_blank">
                Benjamin Wiederkehr
              </Link>
            </div>
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
      </Row>
    </footer>
  );
}
