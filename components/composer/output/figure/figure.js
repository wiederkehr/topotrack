import { forwardRef } from "react";
import styles from "./figure.module.css";

export default forwardRef(function Figure(
  { activity, activityData, format, template, variables },
  ref
) {
  return (
    <div className={styles.figure} ref={ref}>
      {template.render({ activity, activityData, variables, format })}
    </div>
  );
});
