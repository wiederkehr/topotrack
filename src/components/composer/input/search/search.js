import Module from "@/components/composer/interface/module";
import Searchfield from "./searchfield";
import styles from "./search.module.css";

export default function Search({ searchTerm, onSearchChange }) {
  return (
    <Module label="Search">
      <div className={styles.search}>
        <Searchfield searchTerm={searchTerm} onSearchChange={onSearchChange} />
      </div>
    </Module>
  );
}
