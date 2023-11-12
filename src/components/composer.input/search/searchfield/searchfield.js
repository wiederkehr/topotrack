import { TextField } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import styles from "./searchfield.module.css";

export default function Searchfield({ searchTerm, onSearchChange }) {
  return (
    <div className={styles.searchfield}>
      <TextField.Root size="3" className={styles.searchfieldRoot}>
        <TextField.Input
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search activity…"
          className={styles.searchfieldInput}
        />
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
    </div>
  );
}
