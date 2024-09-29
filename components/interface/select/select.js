import * as RS from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import styles from "./select.module.css";

export default function Select({ value, onValueChange, options }) {
  return (
    <RS.Root value={value} onValueChange={onValueChange}>
      <RS.Trigger className={styles.selectTrigger}>
        <RS.Value>{value}</RS.Value>
        <RS.Icon className={styles.selectIcon}>
          <ChevronDownIcon />
        </RS.Icon>
      </RS.Trigger>
      <RS.Content className={styles.selectContent}>
        <RS.ScrollUpButton className={styles.selectScrollButton}>
          <ChevronUpIcon />
        </RS.ScrollUpButton>
        <RS.Viewport className={styles.selectViewport}>
          {options.map((option, index) => (
            <RS.Item className={styles.selectItem} value={option} key={index}>
              <RS.ItemText className={styles.selectItemText}>
                {option}
              </RS.ItemText>
              <RS.ItemIndicator className={styles.selectItemIndicator}>
                <CheckIcon />
              </RS.ItemIndicator>
            </RS.Item>
          ))}
        </RS.Viewport>
        <RS.ScrollDownButton className={styles.selectScrollButton}>
          <ChevronDownIcon />
        </RS.ScrollDownButton>
      </RS.Content>
    </RS.Root>
  );
}
