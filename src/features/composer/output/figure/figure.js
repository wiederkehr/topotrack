import { useParentSize } from "@cutting/use-get-parent-size";
import { forwardRef } from "react";

import styles from "./figure.module.css";

export default forwardRef(function Figure(
  { activity, activityData, format, template, variables },
  ref,
) {
  const size = useParentSize(ref, { width: 0, height: 0 });
  return (
    <div className={styles.figure} ref={ref}>
      {template.render({
        activity,
        activityData,
        variables,
        format,
        size,
      })}
    </div>
  );
});
