import Module from "@/components/composer/interface/module";
import Select from "@/components/composer/interface/select";
import styles from "./themes.module.css";

export default function Themes({ theme, themes, onThemeChange }) {
  return (
    <Module label="Theme">
      <div className={styles.themes}>
        <Select
          value={theme.name}
          onValueChange={onThemeChange}
          options={themes.map(({ name }) => name)}
        />
      </div>
    </Module>
  );
}
