import Image from "next/image";
import Link from "next/link";
import Row from "@/components/layout/row";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Row>
        <div className={styles.footerGrid}>
          <div className={styles.footerGridAlpha}>
            <div className={styles.copyrightBy}>
              {"© "}
              <Link href="https://benjaminwiederkehr.com" target="_blank">
                Benjamin Wiederkehr
              </Link>
            </div>
          </div>
          <div className={styles.footerGridOmega}>
            <Image
              src="/images/api_logo_pwrdBy_strava_horiz_gray.svg"
              height={16}
              width={140}
              alt="Powered by Strava"
              className={styles.poweredBy}
            />
          </div>
        </div>
      </Row>
    </footer>
  );
}
