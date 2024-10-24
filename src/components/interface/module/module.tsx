import { ReactNode } from "react";

import styles from "./module.module.css";

type ModuleProps = {
  children: ReactNode;
  label: ReactNode;
};

type SubmoduleProps = {
  children: ReactNode;
};

function Module({ label, children }: ModuleProps) {
  return (
    <div className={styles.module}>
      <div className={styles.moduleHeading}>{label}</div>
      <div className={styles.moduleContent}>{children}</div>
    </div>
  );
}

function Submodule({ children }: SubmoduleProps) {
  return <div className={styles.submodule}>{children}</div>;
}

export { Module, Submodule };
