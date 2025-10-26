import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { ReactNode, useState } from "react";

import styles from "./module.module.css";

type ModuleProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  label: ReactNode;
};

type SubmoduleProps = {
  children: ReactNode;
};

function Module({ label, children, defaultOpen = true }: ModuleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible.Root
      className={styles.module}
      open={open}
      onOpenChange={setOpen}
    >
      <Collapsible.Trigger className={styles.moduleHeading}>
        <span>{label}</span>
        <ChevronDownIcon
          className={styles.moduleChevron}
          data-state={open ? "open" : "closed"}
        />
      </Collapsible.Trigger>
      <Collapsible.Content className={styles.moduleContent}>
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function Submodule({ children }: SubmoduleProps) {
  return <div className={styles.submodule}>{children}</div>;
}

export { Module, Submodule };
