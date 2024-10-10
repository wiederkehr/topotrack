import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { TextField } from "@radix-ui/themes";

import styles from "./searchfield.module.css";

export default function Searchfield({ searchTerm, onSearchChange }) {
  return (
    <div className={styles.searchfield}>
      <TextField.Root
        size="3"
        className={styles.searchfieldRoot}
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search activity…"
      >
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
    </div>
  );
}
