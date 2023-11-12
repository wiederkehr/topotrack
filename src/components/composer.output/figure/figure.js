import { forwardRef } from "react";
import styles from "./figure.module.css";

export default forwardRef(function Figure(
  { activity, activityData, template, variables },
  ref
) {
  return (
    <div className={styles.figure} ref={ref}>
      <template.Render
        activity={activity}
        activityData={activityData}
        template={template}
        variables={variables}
      />
    </div>
  );
});
