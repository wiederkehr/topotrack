import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { TextField } from "@radix-ui/themes";

import styles from "./searchfield.module.css";

type SearchfieldProps = {
  onSearchChange: (value: string) => void;
  searchTerm: string;
};

function Searchfield({ searchTerm, onSearchChange }: SearchfieldProps) {
  return (
    <div className={styles.searchfield}>
      <TextField.Root
        size="3"
        className={styles.searchfieldRoot}
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search activity…"
      >
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
    </div>
  );
}

export default Searchfield;
export type { SearchfieldProps };
