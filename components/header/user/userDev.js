import * as Avatar from "@radix-ui/react-avatar";
import styles from "./userDev.module.css";

export default function UserDev() {
  return (
    <Avatar.Root className={styles.userAvatar}>
      <Avatar.Fallback className={styles.userAvatarFallback}>
        DEV
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
