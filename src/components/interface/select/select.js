import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import {
  Content,
  Icon,
  Item,
  ItemIndicator,
  ItemText,
  Root,
  ScrollDownButton,
  ScrollUpButton,
  Trigger,
  Value,
  Viewport,
} from "@radix-ui/react-select";

import styles from "./select.module.css";

export default function Select({ value, onValueChange, options }) {
  return (
    <Root value={value} onValueChange={onValueChange}>
      <Trigger className={styles.selectTrigger}>
        <Value>{value}</Value>
        <Icon className={styles.selectIcon}>
          <ChevronDownIcon />
        </Icon>
      </Trigger>
      <Content className={styles.selectContent}>
        <ScrollUpButton className={styles.selectScrollButton}>
          <ChevronUpIcon />
        </ScrollUpButton>
        <Viewport className={styles.selectViewport}>
          {options.map((option, index) => (
            <Item className={styles.selectItem} value={option} key={index}>
              <ItemText className={styles.selectItemText}>{option}</ItemText>
              <ItemIndicator className={styles.selectItemIndicator}>
                <CheckIcon />
              </ItemIndicator>
            </Item>
          ))}
        </Viewport>
        <ScrollDownButton className={styles.selectScrollButton}>
          <ChevronDownIcon />
        </ScrollDownButton>
      </Content>
    </Root>
  );
}
